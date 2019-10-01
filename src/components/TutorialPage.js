import React, { Fragment } from 'react'
import _get from 'lodash/get'
import _format from 'date-fns/format'
import { Link, graphql } from 'gatsby'
import { ChevronLeft } from 'react-feather'

import PageHeader from './PageHeader'
import Content from './Content'
import Layout from './Layout'
import './TutorialPage.css'

const TutorialPage = ({
  title,
  date,
  featuredImage,
  body,
  nextPostURL,
  prevPostURL,
  categories = []
}) => (
    <main>
      <PageHeader
        title={title}
        backgroundImage={featuredImage}
      />
      <article
        className="SinglePost section light"
        itemScope
        itemType="http://schema.org/BlogPosting"
      >
        <div className="container">
          <Link className="SinglePost--BackButton" to="/tutorials/">
            <ChevronLeft /> All Tutorials
          </Link>
          <div className="SinglePost--Content relative">
            <div className="SinglePost--Pagination">
              {prevPostURL && (
                <Link
                  className="SinglePost--Pagination--Link prev"
                  to={prevPostURL}
                >
                  Previous
              </Link>
              )}
              {nextPostURL && (
                <Link
                  className="SinglePost--Pagination--Link next"
                  to={nextPostURL}
                >
                  Next
              </Link>
              )}
            </div>
            <div className="SinglePost--Meta">
              {date && (
                <time
                  className="SinglePost--Meta--Date"
                  itemProp="dateCreated pubdate datePublished"
                  date={date}
                >
                  {_format(date, 'MMMM Do, YYYY')}
                </time>
              )}
              {categories && (
                <Fragment>
                  <span>|</span>
                  {categories.map((cat, index) => (
                    <span
                      key={cat.category}
                      className="SinglePost--Meta--Category"
                    >
                      {cat.category}
                      {/* Add a comma on all but last category */}
                      {index !== categories.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </Fragment>
              )}
            </div>

            <div className="SinglePost--InnerContent">
              <Content source={body} />
            </div>

            <div className="SinglePost--Pagination">
              {prevPostURL && (
                <Link
                  className="SinglePost--Pagination--Link prev"
                  to={prevPostURL}
                >
                  Previous
              </Link>
              )}
              {nextPostURL && (
                <Link
                  className="SinglePost--Pagination--Link next"
                  to={nextPostURL}
                >
                  Next
              </Link>
              )}
            </div>
          </div>
        </div>
      </article>
    </main>
  )

export default TutorialPage