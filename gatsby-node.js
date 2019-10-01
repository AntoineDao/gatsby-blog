const _ = require('lodash')
const path = require('path')
const { graphql } = require('gatsby')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

const getReamdeFrontmatter = (context, source) => {
  const readme = context.nodeModel.getAllNodes({ type: 'MarkdownRemark' })
    .filter(n => n.fileAbsolutePath.toLowerCase().includes(`gatsby-source-git/${source.sourceInstanceName}/readme`)).pop();

  if (readme) {
    return readme.frontmatter
  }
}

exports.createResolvers = ({ createResolvers, createTypes }) => {
  const resolvers = {
    GitRemote: {
      children: {
        resolve: (source, args, context, info) => {
          const mds = context.nodeModel.getAllNodes({ type: 'MarkdownRemark'})
          const notebooks = context.nodeModel.getAllNodes({ type: 'JupyterNotebook' })
          
          const children = mds.concat(notebooks).filter(n => n.fileAbsolutePath.includes(`.cache/gatsby-source-git/${source.sourceInstanceName}`));
          return _.orderBy(children, 'fields.slug', 'asc');
        }
      },
    },
  }
  createResolvers(resolvers)
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes, createFieldExtension } = actions

  createFieldExtension({
    name: 'gitTitle',
    extend: () => ({
      resolve(source, args, context, info) {
        const frontmatter = getReamdeFrontmatter(context, source);
        return frontmatter.title
      }
    })
  })

  createFieldExtension({
    name: 'gitFeaturedImage',
    extend: () => ({
      resolve(source, args, context, info) {
        const frontmatter = getReamdeFrontmatter(context, source);
        return frontmatter.featuredImage
      }
    })
  })

  createFieldExtension({
    name: 'gitDate',
    extend: () => ({
      resolve(source, args, context, info) {
        const frontmatter = getReamdeFrontmatter(context, source);
        return frontmatter.date
      }
    })
  })

  const typeDefs = `
    type GitRemote implements Node {
      title: String @gitTitle
      featuredImage: String @gitFeaturedImage
      date: Date @gitDate
    }
  `
  createTypes(typeDefs)
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions
  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            frontmatter {
              template
              title
            }
            fields {
              slug
              contentType
              template
              tutorialSeries
            }
          }
        }
      }
      allJupyterNotebook(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
              contentType
              template
              tutorialSeries
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const mdFiles = result.data.allMarkdownRemark.edges
    const JupyterNotebooks = result.data.allJupyterNotebook.edges
    const contentTypes = _.groupBy(mdFiles.concat(JupyterNotebooks), 'node.fields.contentType')

    _.each(contentTypes, (pages, contentType) => {
      const pagesToCreate = pages.filter(page => 
        // get pages with template field
        _.get(page, `node.fields.template`)
      )
      if (!pagesToCreate.length) return console.log(`Skipping ${contentType}`)

      console.log(`Creating ${pagesToCreate.length} ${contentType}`)

      pagesToCreate.forEach((page, index) => {
        const id = page.node.id
        const tutorialSeries = page.node.fields.tutorialSeries
        createPage({
          // page slug set in md frontmatter
          path: page.node.fields.slug,
          component: path.resolve(
            `src/templates/${String(page.node.fields.template)}.js`
          ),
          // additional data can be passed via context
          context: {
            id,
            tutorialSeries
          }
        })
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // convert frontmatter images
  fmImagesToRelative(node)

  // Create smart slugs
  // https://github.com/Vagr9K/gatsby-advanced-starter/blob/master/gatsby-node.js
  let slug
  let template
  let contentType

  if (node.internal.type === 'GitRemote') {
    slug = `tutorial/${_.kebabCase(node.sourceInstanceName)}`
  }

  if (node.internal.type === 'MarkdownRemark' || node.internal.type === 'JupyterNotebook') {
    const fileNode = getNode(node.parent)
    const parsedFilePath = path.parse(fileNode.relativePath)
    contentType = parsedFilePath.dir

    if (node.frontmatter && node.frontmatter.template) {
      template = node.frontmatter.template;
    }

    if (_.get(node, 'frontmatter.slug')) {
      slug = `/${node.frontmatter.slug.toLowerCase()}/`
    } else if (
      // home page gets root slug
      parsedFilePath.name === 'home' &&
      parsedFilePath.dir === 'pages'
    ) {
      slug = `/`
    } else if (node.fileAbsolutePath.includes(`.cache/gatsby-source-git/`)) {
      const splitPath = node.fileAbsolutePath.split(`.cache/gatsby-source-git/`)
        .pop().split(`/`).map(p => p.split('.').shift());

      if (splitPath[splitPath.length-1].toLowerCase() === `readme`) {
        createNodeField({
          node,
          name: 'isIndex',
          value: true
        })
        splitPath[splitPath.length - 1] = "";
      }
      slug = `tutorials/${splitPath.map(p => _.kebabCase(p)).join('/')}`

      switch (node.internal.type) {
        case `MarkdownRemark`:
          template = `MarkdownTutorial`;
          break;
        
        case `JupyterNotebook`:
          template = `JupyterTutorial`;
          break;
        
        default:
          break;
      }

      contentType = 'tutorialPages'

      createNodeField({
        node,
        name: 'tutorialSeries',
        // value: _.startCase(splitPath[0])
        value: splitPath[0]
      });

    } else if (_.get(node, 'frontmatter.title')) {
      slug = `/${_.kebabCase(parsedFilePath.dir)}/${_.kebabCase(
        node.frontmatter.title
      )}/`
    } else if (parsedFilePath.dir === '') {
      slug = `/${parsedFilePath.name}/`
    } else {
      slug = `/${parsedFilePath.dir}/`
    }

    // Add slug to node.fields
    createNodeField({
      node,
      name: 'slug',
      value: slug
    })

    // Add contentType to node.fields
    createNodeField({
      node,
      name: 'contentType',
      value: contentType
    })

    // Add template to node.fields
    createNodeField({
      node,
      name: 'template',
      value: template
    })
  }
}

// Random fix for https://github.com/gatsbyjs/gatsby/issues/5700
module.exports.resolvableExtensions = () => ['.json']
