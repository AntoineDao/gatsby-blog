import React from 'react'
import _ from 'lodash'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import TutorialPage from '../components/TutorialPage'

const MarkdownTutorial = ({ data: { post, series } }) => {
  // const thisEdge = allPosts.edges.find(edge => edge.node.id === post.id)
  const { id } = post
  const { title, date, featuredImage } = series

  const currentIndex = _.findIndex(series.children, { id })
  let nextPostURL = null
  let prevPostURL = null

  if (series.children[currentIndex-1]) {
    prevPostURL = series.children[currentIndex-1].fields.slug
  }

  if (series.children[currentIndex + 1]) {
    nextPostURL = series.children[currentIndex + 1].fields.slug
  }

  return (
    <Layout
      meta={post.frontmatter.meta || false}
      title={post.frontmatter.title || false}
    >
      <TutorialPage
        title={title}
        date={date}
        featuredImage={featuredImage}
        body={post.html}
        nextPostURL={nextPostURL}
        prevPostURL={prevPostURL}
      />
    </Layout>
  )
}

export default MarkdownTutorial

export const pageQuery = graphql`
  ## Query for SinglePost data
  ## Use GraphiQL interface (http://localhost:8000/___graphql)
  ## $id is processed via gatsby-node.js
  ## query name must be unique to this file
  query SingleTutorialMarkdown($id: String!, $tutorialSeries: String!) {
    post: markdownRemark(id: { eq: $id }) {
      ...Meta
      html
      id
    }
    series: gitRemote(sourceInstanceName: {eq: $tutorialSeries}) {
      id
      title
      featuredImage
      date
      children {
        ... on MarkdownRemark {
          id
          fields {
            slug
          }
        }
        ... on JupyterNotebook {
          id
          fields {
            slug
          }
        }
      }
    }
  }
`
