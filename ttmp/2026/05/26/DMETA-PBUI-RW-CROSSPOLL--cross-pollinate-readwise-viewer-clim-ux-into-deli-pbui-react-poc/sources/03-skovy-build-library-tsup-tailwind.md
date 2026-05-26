<main><H2>Build a library with tsup and Tailwind</H2> <div><figure><img alt="profile picture" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"> <figcaption>profile picture</figcaption></figure></div> <p>Spencer Miskoviak</p> <p>//</p> <p>July 18, 2023</p> <img alt="" srcSet="/_next/image?url=%2Fposts%2Fbuild-component-libraries-with-tsup-tailwind.jpg&w=640&q=75 640w, /_next/image?url=%2Fposts%2Fbuild-component-libraries-with-tsup-tailwind.jpg&w=750&q=75 750w, /_next/image?url=%2Fposts%2Fbuild-component-libraries-with-tsup-tailwind.jpg&w=828&q=75 828w, /_next/image?url=%2Fposts%2Fbuild-component-libraries-with-tsup-tailwind.jpg&w=1080&q=75 1080w, /_next/image?url=%2Fposts%2Fbuild-component-libraries-with-tsup-tailwind.jpg&w=1200&q=75 1200w, /_next/image?url=%2Fposts%2Fbuild-component-libraries-with-tsup-tailwind.jpg&w=1920&q=75 1920w, /_next/image?url=%2Fposts%2Fbuild-component-libraries-with-tsup-tailwind.jpg&w=2048&q=75 2048w, /_next/image?url=%2Fposts%2Fbuild-component-libraries-with-tsup-tailwind.jpg&w=3840&q=75 3840w" src="https://www.skovy.dev/_next/image?url=%2Fposts%2Fbuild-component-libraries-with-tsup-tailwind.jpg&w=3840&q=75"> <p>Photo by Shubham Dhage</p> <section><p>Frontend tooling is continuously evolving, usually for the better, generally leading to faster, and simpler tooling.</p> <p>One of the latest evolutions for building TypeScript libraries is <a href="https://github.com/egoist/tsup"><code>tsup</code></a>, a no config bundler built with <code>esbuild</code>.</p> <p>On the other side of the frontend tooling spectrum is <a href="https://tailwindcss.com/">Tailwind</a>, a utility-first CSS framework for styling websites and apps.</p> <p>These tools are often used separately for their respective uses, unless you're maybe looking to build a UI component library with TypeScript and Tailwind. This blog post overviews the necessary configuration for both of these tools and others to make them work together, along with a few Tailwind configuration tips learned the hard way.</p> <H2>Getting Started</H2> <p>The first step to create a new library is to create a directory and initialize the the project with the necessary dependencies.</p> <div><pre><code class="language-bash" data-lang="bash"># Create a new project directory named `tsup-tailwind`.
# This should be replaced with the name of your library and used throughout.
mkdir tsup-tailwind

# Initialize `package.json`.
npm init -y

# Install the necessary development dependencies.
npm install -D typescript tsup tailwindcss autoprefixer

# More development dependencies. This post will use React for the UI components
# but this could be replaced with anything tsup/Tailwind both support.
npm install -D react react-dom @types/react @types/react-dom</code></pre></div> <p>These packages each provide something we'll need:</p> <ul> <li><code>typescript</code>: this is a TypeScript project, so we'll need the TypeScript compiler</li> <li><code>tsup</code>: bundle and compile the TypeScript into JavaScript (and other assets like CSS) into something that can be distributed via a npm package</li> <li><code>tailwindcss</code>: styling will be provided in this package with Tailwind</li> <li><code>autoprefixer</code>: add vendor prefixes to the generated CSS to improve browser support</li> <li><code>react</code> / <code>react-dom</code>: the UI components will be built with React, this could be another UI library</li> <li><code>@types/react</code> / <code>@types/react-dom</code>: third-party types for React since it doesn't ship with type definitions</li> </ul> <p>You may add any additional dependencies you may need for the package but these should provide the necessary foundation to build a TypeScript library with Tailwind.</p> <H2>Configuration</H2> <p>The next step is to configure each of these packages to work together.</p> <H3>TypeScript</H3> <p>First, initialize the TypeScript configuration.</p> <div><pre><code class="language-bash" data-lang="bash">./node_modules/.bin/tsc --init</code></pre></div> <p>It will generate a configuration file named <code>tsconfig.json</code> with some default values (and lots of comments).</p> <div><pre><code class="language-json" data-lang="json">// tsconfig.json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}</code></pre></div> <p>This default configuration works for the purposes of this library, but adjust as necessary for your use case.</p> <p>Since we're also using React, we need to enable the <code>jsx</code> compiler option. If we don't, we'll later see the following error when trying to write JSX.</p> <div><pre><code>Cannot use JSX unless the --jsx flag is provided.</code></pre></div> <p>To fix this and support JSX, update the <code>jsx</code> compiler option to <code>react-jsx</code> in <code>tsconfig.json</code>.</p> <div><pre><code class="language-json" data-lang="json">// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx"
    // Other configuration...
  }
}</code></pre></div> <p>Then, we can create a simple file in <code>src/index.tsx</code> to test the rest of the configuration.</p> <div><pre><code class="language-ts" data-lang="ts">// src/index.tsx

console.log("Hello World!");</code></pre></div> <H3>tsup</H3> <p>The next step is to configure <code>tsup</code> to bundle the project into a distributable package. It supports multiple configurations, but I prefer the <code>tsup.config.ts</code> format to have a type-safe configuration.</p> <div><pre><code class="language-ts" data-lang="ts">// tsup.config.ts

import { defineConfig } from "tsup";

export default defineConfig({
  // The file we created above that will be the entrypoint to the library.
  entry: ["src/index.tsx"],
  // Enable TypeScript type definitions to be generated in the output.
  // This provides type-definitions to consumers.
  dts: true,
  // Clean the `dist` directory before building.
  // This is useful to ensure the output is only the latest.
  clean: true,
  // Sourcemaps for easier debugging.
  sourcemap: true,
});</code></pre></div> <p>Then, we can define a <code>build</code> script in <code>package.json</code> to run <code>tsup</code> and define the <code>main</code> entrypoint for the package. This may vary depending on the <a href="https://tsup.egoist.dev/#bundle-formats">output format</a>.</p> <div><pre><code class="language-json" data-lang="json">// package.json
{
  "main": "dist/index.js",
  "scripts": {
    "build": "tsup"
  }
  // Other configuration...
}</code></pre></div> <p>Finally, we can run this script to build the package.</p> <div><pre><code class="language-bash" data-lang="bash">npm run build</code></pre></div> <p>By default <code>tsup</code> will output to <code>dist</code> so we can confirm the file exists and that it works as expected.</p> <div><pre><code class="language-bash" data-lang="bash">$ node dist/index.js
# Hello World!</code></pre></div> <p>If you explore the <code>dist</code> directory you should also notice the type definitions and sourcemaps. The only thing missing are the styles.</p> <H3>Tailwind</H3> <p>The final step is to configure Tailwind to generate the CSS for the library. Start by initializing the Tailwind configuration.</p> <div><pre><code class="language-bash" data-lang="bash">./node_modules/.bin/tailwindcss init</code></pre></div> <p>This will output a <code>tailwind.config.js</code> file with the following empty defaults.</p> <div><pre><code class="language-js" data-lang="js">// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
};</code></pre></div> <p>The only thing that needs to be updated is <code>content</code>, which defines where the Tailwind classes are used so it can accurately bundle only the necessary CSS. The rest of the configuration can be removed unless you need it.</p> <div><pre><code class="language-js" data-lang="js">// tailwind.config.js

module.exports = {
  content: ["./src/**/*.tsx"],
};</code></pre></div> <p>Then, the Tailwind directives need to be added to the main CSS entrypoint so we can add a <code>global.css</code> file in the <code>src</code> directory.</p> <div><pre><code>/* src/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;</code></pre></div> <p>Next, import this CSS file into the entrypoint file so it's bundled into the package output.</p> <div><pre><code class="language-tsx" data-lang="tsx">// src/index.tsx
import "./global.css";

const Demo = () =&gt; {
  return &lt;div className="p-4 text-white bg-black"&gt;demo&lt;/div&gt;;
};

export default Demo;</code></pre></div> <p>Finally, configure PostCSS with Tailwind and <code>autoprefixer</code> so that <code>tsup</code> can <a href="https://tsup.egoist.dev/#css-support">bundle the CSS</a>.</p> <div><pre><code class="language-js" data-lang="js">// postcss.config.js
module.exports = {
  plugins: [require("tailwindcss")(), require("autoprefixer")()],
};</code></pre></div> <p>Now, everything should be configured end-to-end so we can test the final output.</p> <div><pre><code class="language-bash" data-lang="bash">npm run build</code></pre></div> <p>Inspecting the <code>dist</code> directory should show an <code>index.css</code> file with the Tailwind styles and an <code>index.js</code> file with the output JavaScript, along with the type definitions and sourcemaps.</p> <H2>Usage</H2> <p>Now the package can be built and <a href="https://docs.npmjs.com/cli/v8/commands/npm-publish">published</a>.</p> <p>Once this package is installed, the styles need to be imported so they can be bundled into the consuming applications' styles. The component can also be imported and rendered assuming it's another React app.</p> <div><pre><code class="language-js" data-lang="js">import "tsup-tailwind/dist/index.css";
import Demo from "tsup-tailwind";</code></pre></div> <p>The exact way it's imported and bundled will depend on the consuming application, but the above should work in frameworks like <a href="https://nextjs.org/">Nextjs</a>.</p> <H2>Tailwind Tips</H2> <p>The following configurations are optional depending on your use case.</p> <p>If you are making a specific library for one consumer you control and you know these won't be issues, none of these options need to be configured. If you are making a general library, you probably want to enable most, or all of the following Tailwind configurations to offer the most flexibility to your library consumers.</p> <H3>Avoid class name collisions</H3> <p>It's possible your downstream consumers of this package are also using Tailwind, or by chance have similar global class names. Since this package's CSS is built with Tailwind, there's a chance for naming collisions since the same Tailwind class could be defined both in this package's CSS and in the consuming applications' CSS. This can lead to undesirable or unexpected issues, so it's best to avoid naming collisions entirely.</p> <p>Fortunately, Tailwind provides the <a href="https://tailwindcss.com/docs/configuration#prefix"><code>prefix</code></a> configuration option exactly for this purpose.</p> <div><pre><code class="language-js" data-lang="js">// tailwind.config.js

module.exports = {
  content: ["./src/**/*.tsx"],
  prefix: "demo-",
};</code></pre></div> <p>This configuration will append <code>demo-</code> to every utility class. The <code>Demo</code> component can be updated to include this prefix.</p> <div><pre><code class="language-tsx" data-lang="tsx">// src/index.tsx
import "./global.css";

const Demo = () =&gt; {
  return &lt;div className="demo-p-4 demo-text-white demo-bg-black"&gt;demo&lt;/div&gt;;
};

export default Demo;</code></pre></div> <p>Now, rebuilding and inspecting <code>dist/index.css</code> should show the updated CSS output with the <code>demo-</code> prefixes.</p> <div><pre><code class="language-bash" data-lang="bash">npm run build</code></pre></div> <H3>Avoid global resets</H3> <p>A similar problem to class name collisions are global style resets.</p> <p>By default, Tailwind provides an opinionated set of base styles. In most apps, this is desirable because it gives you a consistent, blank slate. However, since most apps or design systems define this for themselves, we don't want to interfere with those (unless this is the design system library in which case maybe you do want to).</p> <p>Again, Tailwind fortunately provides the <a href="https://tailwindcss.com/docs/preflight"><code>preflight</code></a> configuration option to disable this.</p> <div><pre><code class="language-js" data-lang="js">// tailwind.config.js

module.exports = {
  content: ["./src/**/*.tsx"],
  prefix: "demo-",
  corePlugins: {
    preflight: false,
  },
};</code></pre></div> <p>Now, rebuilding and inspecting <code>dist/index.css</code> should no longer include the global preflight styles.</p> <div><pre><code class="language-bash" data-lang="bash">npm run build</code></pre></div> <p>This also means you won't have the global resets available in this library when developing locally, for example using Storybook. This means you will need to override many of the browser default styles but this will result in a more resilient component that doesn't depend on specific global resets.</p> <blockquote> <p>Note: disabling <code>preflight</code> is not the same as removing <code>@tailwind base;</code> from <code>src/global.css</code>. The <code>@tailwind base;</code> directive is still necessary for certain Tailwind variables to be defined correctly.</p> </blockquote> <H3>Manual class-based dark mode</H3> <p>A common feature in many apps today is dark mode.</p> <p>By default, Tailwind provides a <a href="https://tailwindcss.com/docs/dark-mode"><code>dark</code></a> variant that can be prefixed before utilities to apply them only when the user has enabled dark mode based on the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme"><code>prefers-color-scheme</code></a> CSS media query. Again, this is desirable in most apps since it matches the users preferences by default.</p> <p>However, this is not desirable in a library because it's not possible to know if the consuming application is using dark mode or not. Additionally, the consuming application may want to apply dark mode differently, for example as a class on the <code>html</code> element.</p> <p>This can be solved by using the <a href="https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually"><code>darkMode</code></a> Tailwind configuration option.</p> <p>First, the <code>Demo</code> component can be updated to use the <code>dark</code> variant to apply styles in dark mode.</p> <div><pre><code class="language-tsx" data-lang="tsx">// src/index.tsx
import "./global.css";

const Demo = () =&gt; {
  return (
    &lt;div className="demo-p-4 demo-text-white dark:demo-text-black demo-bg-black dark:demo-bg-white"&gt;
      demo
    &lt;/div&gt;
  );
};

export default Demo;</code></pre></div> <p>Then, the Tailwind configuration can be updated. This configuration option was not intuitive the first time I saw it and took some experimentation.</p> <p>Here is a summary of how it works:</p> <ul> <li>It can be a string, or a two element array of strings.</li> <li>It defaults to <code>"media"</code> but can be configured to <code>"class"</code>, which will cause it to instead be enabled by a <code>.dark</code> class on a parent element.</li> <li>If you also have the <code>prefix</code> enabled that also applies to the dark mode class, so in this case <code>.demo-dark</code> would be the class name. This may work if you want a unique dark mode class only for this library, but it won't work if you want to use the same dark mode class name as the consuming application.</li> <li>If you want to customize the <code>.dark</code> class name to any selector, you define it as the second element in an array where the first element is still <code>"class"</code>. This is not itself a class, but any CSS selector.</li> </ul> <p>In this case, let's say we want the consuming application to apply the class name <code>.dark</code> to the <code>html</code> element to enable dark mode for our library. This can be configured with the following CSS selector.</p> <div><pre><code class="language-js" data-lang="js">// tailwind.config.js

module.exports = {
  content: ["./src/**/*.tsx"],
  prefix: "demo-",
  corePlugins: {
    preflight: false,
  },
  darkMode: ["class", 'html[class~="dark"]'],
};</code></pre></div> <p>Now, rebuilding and inspecting <code>dist/index.css</code> should include the dark mode selector and styles.</p> <div><pre><code class="language-bash" data-lang="bash">npm run build</code></pre></div> <p>This should cover most of the Tailwind options you may want to consider when building a library and distributing the CSS.</p> <H2>Local testing with yalc</H2> <p>One last tip for local testing of npm packages. <a href="https://docs.npmjs.com/cli/v8/commands/npm-link"><code>npm link</code></a> is the default way to test npm packages locally in another project, but is notoriously brittle.</p> <p>Another solution is to use <a href="https://github.com/wclr/yalc"><code>yalc</code></a>, an alternative approach for testing npm packages locally.</p> <p>It can be globally installed, then used to publish and add a package to and from a local repository and solves many of the pains of <code>npm link</code>.</p> <div><pre><code class="language-bash" data-lang="bash"># Globally install the `yalc` package and command
npm i yalc -g

# Publish the package to the local repository
# Run this in the library directory, eg: tsup-tailwind
yalc publish

# Add the package to a local project
# Run this in the consuming project directory
yalc add tsup-tailwind</code></pre></div> <p>The consuming application should now be using the local version of the npm package. This allows manually testing the package building and publishing end-to-end without having to publish it to npm until you're ready.</p> <p>If you find changes you need to make to the library, <code>yalc push</code> can be a handy command to both publish and push the update other projects that have installed the local package.</p> <div><pre><code class="language-bash" data-lang="bash"># Rebuild the package, publish it to the local repository, and
# push the update to other local projects that have installed it
npm run build &amp;&amp; yalc push</code></pre></div> <H2>Conclusion</H2> <p>The configuration to get <code>tsup</code> to build a TypeScript library with Tailwind styles isn't complex, but it's spread out across a few tools that makes it tedious enough to get the exact configuration for your use case. Hopefully the steps outlined in this post will help you get started building your own TypeScript library with Tailwind.</p> <p>If you have any more tips for building libraries with <code>tsup</code> and Tailwind, please share!</p></section><section><p>Tags:</p><ul><li><a href="https://www.skovy.dev/blog?tag=css">css</a></li> <li><a href="https://www.skovy.dev/blog?tag=typescript">typescript</a></li></ul></section> <div><H2>course</H2> <H3>Practical Abstract Syntax Trees</H3> <p>Learn the fundamentals of abstract syntax trees, what they are, how they work, and dive into several practical use cases of abstract syntax trees to maintain a JavaScript codebase.</p><a href="https://www.newline.co/courses/practical-abstract-syntax-trees?ref=skovy.dev-card">Check out the course</a></div></main>
