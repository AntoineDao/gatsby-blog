import React from 'react'
import { graphql } from 'gatsby'
import { Location } from '@reach/router'
// import qs from 'qs'
import _startCase from 'lodash/startCase'

import PageHeader from '../components/PageHeader'
import PostSection from '../components/PostSection'
import PostCategoriesNav from '../components/PostCategoriesNav'
import Layout from '../components/Layout'

/**
 * Filter posts by date. Feature dates will be fitered
 * When used, make sure you run a cronejob each day to show schaduled content. See docs
 *
 * @param {posts} object
 */
export const byDate = posts => {
  const now = Date.now()
  return posts.filter(post => Date.parse(post.date) <= now)
}

/**
 * filter posts by category.
 *
 * @param {posts} object
 * @param {title} string
 * @param {contentType} string
 */
export const byCategory = (posts, title, contentType) => {
  const isCategory = contentType === 'postCategories'
  const byCategory = post =>
    post.categories &&
    post.categories.filter(cat => cat.category === title).length
  return isCategory ? posts.filter(byCategory) : posts
}

// Export Template for use in CMS preview
export const TutorialIndexTemplate = ({
  title,
  subtitle,
  featuredImage,
  posts = [],
  postCategories = [],
  enableSearch = true,
  contentType
}) => (
  <Location>
    {({ location }) => {
      // let filteredPosts =
      //   posts && !!posts.length
      //     ? byCategory(byDate(posts), title, contentType)
      //     : []

      // let queryObj = location.search.replace('?', '')
      // queryObj = qs.parse(queryObj)

      // if (enableSearch && queryObj.s) {
      //   const searchTerm = queryObj.s.toLowerCase()
      //   filteredPosts = filteredPosts.filter(post =>
      //     post.frontmatter.title.toLowerCase().includes(searchTerm)
      //   )
      // }

      return (
        <main className="Blog">
          <PageHeader
            title={title}
            subtitle={subtitle}
            backgroundImage={featuredImage}
          />

          {!!postCategories.length && (
            <section className="section thin">
              <div className="container">
                <PostCategoriesNav enableSearch categories={postCategories} />
              </div>
            </section>
          )}

          {!!posts.length && (
            <section className="section">
              <div className="container">
                <PostSection posts={posts} />
              </div>
            </section>
          )}
        </main>
      )
    }}
  </Location>
)

// Export Default TutorialIndex for front-end
const TutorialIndex = ({ data: { page, tutorials } }) => (
  <Layout
    meta={page.frontmatter.meta || false}
    title={page.frontmatter.title || false}
  >
    <TutorialIndexTemplate
      {...page}
      {...page.fields}
      {...page.frontmatter}
      posts={tutorials.edges.map(tutorial => ({
        title: _startCase(tutorial.node.sourceInstanceName),
        slug: `tutorials/${tutorial.node.sourceInstanceName}`,
        ...tutorial.node.children.filter(c => c.fields && c.fields.isIndex).shift().frontmatter,
      }))}
    />
  </Layout>
)

export default TutorialIndex

export const pageQuery = graphql`
  ## Query for TutorialIndex data
  ## Use GraphiQL interface (http://localhost:8000/___graphql)
  ## $id is processed via gatsby-node.js
  ## query name must be unique to this file
  query TutorialIndex($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      ...Meta
      fields {
        contentType
      }
      frontmatter {
        title
        excerpt
        template
        subtitle
        featuredImage
      }
    }
    tutorials: allGitRemote {
      edges {
        node {
          sourceInstanceName
          full_name
          pathname
          children {
            ... on MarkdownRemark {
              fileAbsolutePath
              excerpt
              fields {
                slug
                tutorialSeries
                isIndex
              }
              frontmatter {
                title
                featuredImage
                excerpt
              }
            }
          }
        }
      }
    }
  }
`
