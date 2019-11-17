---
template: SinglePost
title: Blogging Platforms
status: Featured / Published
date: '2019-10-10'
featuredImage: 'https://images.unsplash.com/photo-1542435503-956c469947f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80'
excerpt: >- 
  On the joys of choosing which blogging platform to use for this website. Wordpress | Ghost | Gatsby
categories:
  - category: Front End
meta:
  canonicalLink: ''
  description: On the joys of choosing which blogging platform to use for this website. Wordpress | Ghost | Gatsby
  noindex: false
  title: Choosing a blogging platform
---

I have finally commited some time asside to set up a wee blog to keep track of and share some of the projects I work on. This post is a quick ramble about how and why I picked the front end framework to build this blog.

> **/!\    spoiler**: I chose GatsbyJS    **/!\**

## Setting Requirements

When it comes to blogging there is quite a wide selection of tools to chose from. For this reason I needed to compile a list of requirements and desires for this personal webiste.

I wanted to be able to:

1. Share blogposts about project work / interesting stuff
2. Share reproduceable Tutorials from Jupyter Notebooks
3. Build a nice *about me* page
4. Actually be able to modify the HTML code to customise the template I was inevitably going to use...

## Go Compare

With this list of requirements at hand, I could now scour the internet after searching *"blogging front end framework"*. I have compiled an overview of the main tools I looked into and how they fit with my requirements.

| Framework           | Coding Language | Blogging | Jupyter Tutorials | Fancy About Me | Front End Tools I Understand |
| ------------------- | :-------------: | :------: | ----------------: | -------------: | ---------------------------: |
| Jekyll/Github Pages |      Ruby       |   Yes    |           Sort Of |            Yes |                           No |
| Wordpress           |       PHP       |   Yes    |                No |            Yes |                           No |
| Ghost               |     NodeJS      |   Yes    |                No |            Yes |                      Sort Of |
| Hugo                |     Golang      |   Yes    |                No |            Yes |                           No |
| GatsbyJs            | NodeJS/GraphQL  |   Yes    |               Yes |            Yes |                 Yes (React!) |
<br/>

<div align="center">
  <img src="https://jekyllrb.com/img/logo-2x.png" />
</div>

### Jekyll ([Link](https://jekyllrb.com/)}

I have used this tool before, in fact the first iteration of a blog that I set up a few years ago was a Jekyll blog. It worked relatively well at the time as I had used minimal customization on top of the theme I had set up. I found limitations when I tried to set up the Jupyter Notebook based tutorials however as the HTML was copy pasted manually and just looked nasty when combined with the CSS forms from the default Jekyll theme.

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/WordPress_blue_logo.svg/200px-WordPress_blue_logo.svg.png" />
</div>

### Wordpres ([Link](https://wordpress.com/))

I had also used wordpress in the past however felt it was a completely overkill solution. I also thought it would cause plugin hell as I tried to mix `WP to Twitter`, `Table Press` and `Yeost SEO` without being able to easily modify the plugins because I can't PHP... And finally I have no idea how to cleanly build/customise page templates.

<div align="center">
  <img src="https://exceptionnotfound.net/content/images/2017/09/ghost-logo.png" />
</div>

### Ghost ([Link](https://ghost.org/))

I had heard about Ghost through a friend at my old work. They had implemented it quite nicely as a CMS tool to manage the company's blog and business facing content while still enabling non-techies to write/manage content through a nice interface. I gave it a good try (at least 2 days!) before giving up because I just couldn't customise the front-end the way I wanted. Don't get me wrong, this isn't a bad tool. It's just that I'm not good at using [handlebars](https://ghost.org/docs/api/v3/handlebars-themes/) to create front-end themes and didn't have the patience to learn it properly. One other thing to note, which I found quite nice, is that Ghost is intirely written in NodeJs, which mean there was less context shifting when working with Javascript/HTML/CSS afterwards. It also meant that I could interface with the content API a lot better as I am familiar with the language.

<div align="center">
  <img src="https://www.megadix.it/img/blog/new-website-with-hugo/banner.png" />
</div>

##### Hugo ([Link](https://gohugo.io))

Full disclosure... I only found Hugo after building this blog with Gatsby. I still don't think I would have used it but it's worth a mention as it's written in Golang (new trendy language alert!) and accordingly boasts ridiculously fast performance (>1ms per page build).

<div align="center">
  <img src="https://www.gatsbyjs.org/static/e4755730e3f0ff67b3ebd98342371e7d/0c9b9/gradient.jpg" />
</div>

### GatsbyJS ([Link](https://www.gatsbyjs.org/))

Gatsby creeped up on me as I wanderd trough React tools for blogging. I was immediately seduced by the use of GraphQL to delivery the promise of a unified content API. y this I mean that, through the use of plugins written in NodeJs, interfacing with the Gatsby API, I could create GraphQL schemas that I could query to build pages programatticaly. This definitely ticked my blogging & tutorial requirements. It also meant that, at a strech, I could include some "About Me" information in some format that I could then also query through GraphQL (eg: list of jobs in a CSV or top starred Github repositories).

Furthermore, Gatsby offers the possibility of pluging into quite a few front-end frameworks, which includes React. Having recently dabbled with Facebook's tool I was more confident to pick it up instead of "pure" HTML.


## Actually Building the Thing

I now had a framework at hand and was ready to write code and content to my heat's desire. Create-React-App wasn't going to cut it however so I needed a decent starting template to work from. I scoured for quite a while until I stumbled upon this clean, fresh and simple theme called `Yellowcake` (check it out [here](https://github.com/thriveweb/yellowcake)) by [Thrive Web](https://thriveweb.com.au/) (a web design company based in Gold Coast, Australia). On top of providing a good visual baseline for this blog, their template also came with the configuration requirements to deploy the website to Netlify and manage content using [Netlify CMS](https://www.netlifycms.org/).

After some initial shuffling about I managed set up a working website with some working links to my social media accounts and some Jupyter Tutorials migrated in a clean format that matched that of blog posts. I am yet to build a good "About Me" page but have faith it will be a fun creative experience thanks to React and Gatsby!