import React from 'react'
import { graphql } from 'gatsby'
import _ from 'lodash'

import PageHeader from '../components/PageHeader'
import Content from '../components/Content'
import Layout from '../components/Layout'
import PostSection from '../components/PostSection'

// Export Template for use in CMS preview
export const HomePageTemplate = ({ title, subtitle, featuredImage, body }) => (
  <main className="Home">
    <PageHeader
      large
      title={title}
      subtitle={subtitle}
      backgroundImage={featuredImage}
    />

    <section className="section">
      <div className="container">
        <Content source={body} />
      </div>
    </section>
  </main>
)

// Export Default HomePage for front-end
const HomePage = ({ data: { page, posts, tutorials } }) => (
  <Layout meta={page.frontmatter.meta || false} >
    <HomePageTemplate {...page} {...page.frontmatter} body={page.html} />
    <section className="section">
      <div className="container">
        <PostSection
          title="Tutorials"
          posts={tutorials.edges.map(tutorial => ({
            title: _.startCase(tutorial.node.sourceInstanceName),
            slug: `tutorials/${tutorial.node.sourceInstanceName}`,
            ...tutorial.node.children.filter(c => c.fields && c.fields.isIndex).shift().frontmatter,
          }))}
        />
        <br />
        <h3 className="taCenter">
          <a href="/blog/">All Tutorials...</a>
        </h3>
      </div>
    </section>
    <section className="section"> 
      <div className="container">
        <PostSection 
          title="Latest Posts"
          posts={posts.edges.map(post => ({
            ...post.node,
            ...post.node.frontmatter,
            ...post.node.fields
          }))}
        />
        <br />
        <h3 className="taCenter">
          <a href="/blog/">All Posts...</a>
        </h3>
      </div>
    </section>
  </Layout>
)

export default HomePage

export const pageQuery = graphql`
  ## Query for HomePage data
  ## Use GraphiQL interface (http://localhost:8000/___graphql)
  ## $id is processed via gatsby-node.js
  ## query name must be unique to this file
  query HomePage($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      ...Meta
      html
      frontmatter {
        title
        subtitle
        featuredImage
      }
    }
    posts: allMarkdownRemark(
      filter: { fields: { contentType: { eq: "posts" } } }
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 3
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            date
            categories {
              category
            }
            featuredImage
          }
        }
      }
    }
    tutorials: allGitRemote {
      edges {
        node {
          sourceInstanceName
          full_name
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
