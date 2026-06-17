# Boilerplate Template for a Directory Business

Welcome to our directory business template, designed to harness the full power of [Next.js 14](https://nextjs.org) with App Router and seamlessly integrated with a [Supabase](https://supabase.com) database. This template provides a robust and fully-custom CMS to meet all your directory business needs.

Follow the official documentation here: [DirectoryStack Docs](https://directorystack.com/docs)

## Features

- 🚀 **High-Performance Static Website:** Enjoy lightning-fast page loads with our optimized static site setup, powered by a custom CMS.
- 🛠️ **Type Safety:** Leverage full type safety with TypeScript and Supabase `gen types` functionality, ensuring robust and error-free development.
- 📄 **Comprehensive Directory Features:** Includes listing overviews, individual listing pages, tags, and categories to keep your directory well-organized.
- 🔍 **AI-Powered Search:** An intelligent search bar that understands user queries, even when described in natural language.
- ✍️ **AI Content Creation:** Automatically generate descriptions for tags and categories based on your niche, saving time on content creation.
- 📈 **Powerful KPI Calculation:** Track essential metrics such as:
  - Visits
  - Clicks
  - Average Ratings
  - Active Listings Count
  - Active Ads Count
  - Lifetime Revenue
  - (and more)
- 📝 **Custom Blog:** Fully static blog with support for topics and authors, perfect for content marketing.
- 🗂️ **Comprehensive Admin Area:** Manage all aspects of your directory with:
  - KPI Dashboard
  - Activity Feed
  - Listings Manager
  - Blog Post Manager
  - Ads Manager
  - Promotions Manager
  - Feedback Manager
  - Comments Manager
  - Categories Manager
  - Tags Manager
- 🗨️ **Commenting System:** Enable logged-in users to comment on listings, enhancing user engagement.
- 👤 **User Account Management:** Users can manage their accounts, payment details, listings, and even create their own blog posts (if permitted).
- 💬 **User Feedback Collection:** Gather feedback in three ways:
  - Open feedback via a custom feedback box.
  - Listing proposals through a dedicated form.
  - Listing-specific feedback like "Report this listing."
- ✨ **Custom Authoring Environment:** A secure, customizable authoring environment accessible at `YOUR_DOMAIN.com/secret-admin`.
- 🌐 **SEO Optimization:** Built-in SEO features for better visibility on search engines.
- 🗺️ **Automated Sitemap Creation:** Ensure your site is always up-to-date with search engines.
- 🔒 **Best Practices:** Adherence to Next.js best practices, including global error management.
- 📱 **Fully Responsive:** Mobile-friendly design with dark and light modes.
- 💡 **Shadcn / UI Components:** Aesthetic and functional UI components to enhance user experience.
- 🔧 **Customizable Settings:** Easily toggle features on or off, including:
  - Click and view counting
  - Like and star rating systems
  - User-created listings vs. admin-only listings
  - Self-service promotions (integrated with Stripe)
  - Pre-approval of user-created content
  - AI content generation for users
- 💵 **Revenue Generation:** Monetize your site with:
  - A custom ads manager for displaying and managing ads.
  - A self-service tool for users to promote their own listings.
- 🖥️ **MDX Support:** Create beautiful, rich content for listing pages with MDX.

This template is designed to provide everything you need to launch and run a successful directory business, from powerful backend capabilities to user-friendly front-end features.

## Demo

Fully Functional Demo - 100% based on this template: [DomainersKit.com](https://domainerskit.com)

## How to Use

0. You are reading this README, so you already have access to the boilerplate. You made a great choice. Congrats!
1. Go to your favorite IDE (e.g., VS Code).
2. Create a new folder for cloning the repository.
3. In VS Code, click "Clone Git Repository" and select the **Directory Boilerplate**.
4. You should now have the code on your local machine.

# Configuration

## Step 1. Set up the environment

Rename the `.env.local.example` file to `.env.local`. It should have the following entries:

```bash
# LOCAL DEVELOPMENT ENVIRONMENT VARIABLES
NODE_ENV=development
# A Random Password to secure your APIs
API_SECRET_KEY=
# SUPABASE - DATABASE
NEXT_PUBLIC_SUPABASE_PROJECT_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
# UMAMI - ANALYTICS
NEXT_PUBLIC_UMAMI_ID=
# OPENAI - AI CONTENT API
OPENAI_API_KEY=
# STRIPE - PAYMENT
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

```

### Dev Environment

1. In the `env.local` file, leave the `NODE_ENV` as `development`. You'll need to update this when you eventually host your application. We will go over this in the "Deploy" section.
2. Generate a super secure password or passphrase and provide it as the `API_SECRET_KEY`.
3. Go to the `vercel.json` file and change `[YOUR_API_SECRET_KEY]` to the passphrase you just created. This is the only file that cannot read the .env file (as it is a JSON). All other files will pull this password automatically.

### Supabase Setup & Tokens

We choose Supabase as the database provider for this project as it has a generous free tier.

1. Create a free account at [Supabase](https://supabase.com) and a new project. Remember the **Database Password**; we will need it later.
2. Log in, and in the left sidebar, click on `Project Settings` (at the bottom).
3. Copy the Project Reference ID (a long string of letters) and paste it as the `NEXT_PUBLIC_SUPABASE_PROJECT_ID`.
4. In the Settings Menu, click on API, and copy the Project URL and paste it as the `NEXT_PUBLIC_SUPABASE_URL`.
5. On the same page, copy the ANON PUBLIC API KEY and paste it as the `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. On the same page, copy the service_role key and paste it as the `SUPABASE_SERVICE_ROLE_KEY` (Never share this key anywhere except with your hosting provider because it can bypass Supabase RLS).
7. Go to the `package.json` file, and in 'scripts: { typgen: }', replace `YOUR_SUPABASE_PROJECT_ID` with the `NEXT_PUBLIC_SUPABASE_PROJECT_ID`. (Hint: Do not enclose this id in '')

### Setup Resend for Transactional Emails

Supabase's free tier allows for 3 transactional emails per hour. Generous for testing purposes, but we want to scale! That is why we chose Resend.com for transactional emails because they have a generous free tier of currently 3k transactional emails per month and are easily integratable with Supabase for auth emails. You can, of course, skip this part while setting it up, but before launching, I highly recommend switching to Resend.

1. Head over to [Resend](https://resend.com) and create a free account.
2. Follow this guide: [Send with Supabase SMTP](https://resend.com/docs/send-with-supabase-smtp) (alternatively, activate this integration: [Supabase Resend Integration](https://supabase.com/partners/integrations/resend)).
3. Disable `Click Tracking` under resend.com/domains. While we like knowing whether our links are clicked, Resend is using AWS click tracking under the hood, which might get your emails in spam - not a great user experience. As this is merely a confirmation email, it should be fine.

### Umami Setup & Tokens

We choose Umami.is as the analytics provider because it has a generous free tier and is GDPR/CCPA compliant without setting cookies (e.g., you will not need any cookie banner!).

1. Create a free account at [Umami.is](https://umami.is).
2. Click on `+ Add website` and provide your website name and the final domain. E.g., "Name: DirectoriesHQ", "Domain: directorieshq.com" (no https).
3. Click on `Edit` and copy the `Website ID`.
4. Paste it into your `.env.local` as your `NEXT_PUBLIC_UMAMI_ID`.
5. You are done with Umami.

### OpenAI Setup & Tokens

We use OpenAI to create embeddings for the listings (AI-powered Semantic Search!), and for the "Ai Content Generation Buttons" (like to tags, categories, blog posts and listing descriptions).

There will be costs associated with it. This template uses the cheap `gpt-4o-mini` model.

As per [openai.com](https://openai.com/api/pricing/), the current costs are US$0.15 / 1M tokens (input) and US$0.6 /
1M tokens (output). For a test project, we clicked the listing button 70 times (resulting in 70 descriptions and excerpts) and used 25k tokens (40% input & 60% output), which resulted in costs of US$0.0015 (input) and US$0.009 (output), totaling US$0.0105 (approximately 1 cent). For an example, head over to the test project [DomainersKit / Domainhacks.info](https://domainerskit.com/explore/domainhacks-info) and read the excerpt (the short description) and then the long text (the long description). This is what you'll get.

1. Create an account at [openai.com](https://platform.openai.com/apps).
2. On the left sidebar, click on `API Keys`.
3. Click on `+ Create new secret key`.
4. Give it a name, set the permissions to `Restricted`, and allow `Write` for the `Model capabilities`. Then hit `Create secret key`.
5. Copy the newly created key and paste it into your `.env.local` as the `OPENAI_API_KEY`.

### Stripe Setup & First Product & First Coupon

You will only need this part if you intend to use Stripe for payments regarding user-driven listing promotions. If you do not set the three Stripe keys, the user will see a "Write us an email to promote your listing" notification instead of a self-signup form. It is advisable to perform steps 2-7 in "Test Mode" first before going live. The toggle is in the top right menu.

1. Create a free account at [Stripe](https://stripe.com).
2. Follow the onboarding flow and set up your account.
3. Go to https://dashboard.stripe.com/settings/tax and activate automated tax calculations. If you don't want to use this feature, go to the file `createStripeCheckoutSession.ts` and remove the line `automatic_tax: { enabled: true },` from `const session = ...`.
4. Next, click on `Developers` in the top menu and then on `API keys`. Copy the publishable key as the `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
5. On the same page, copy the Secret Key and add it as the `STRIPE_SECRET_KEY`.
6. Still in the developer menu, click on `Webhooks` (right next to `API keys`), and create a new endpoint (https://YOURDOMAIN.com/api/payment/stripe-receipt). (If you want to test it locally, use the Stripe CLI and follow the steps in the Stripe docs).
7. In the webhook menu for this custom webhook, click on `Signing Secret Reveal` and copy this value as the `STRIPE_WEBHOOK_SECRET`.

This was the setup of the Stripe account. While you are on stripe.com:

1. Create a new product by heading to the `product catalog` and clicking the button `Add product`.
2. Name it `Promoted Listing`, give it a ONE-TIME price of USD 1.00 (or whatever your price shall be for a listing to be promoted for 1 day).
3. In the top-right corner of the product page, copy the `product id` which starts with 'price\_' and paste it into the file `app/constants/constants.ts` as the `STRIPE_PRICE_ID` where we define `PROMOTIONS_DATA`.
4. Next, again in the `product catalog` on Stripe.com, click on `Coupons` and add a new coupon. This will be the automatic discount for when a user buys more than 30 days of promotions. E.g., create a 10% discount code, with a duration of forever. Once created, you'll need to copy the `ID` which you find under `Details`. IGNORE the API ID of the coupon, which is NOT needed here. The `ID` is a lot shorter than the API ID. Add this coupon as the `STRIPE_COUPON_ID` to the `PROMOTIONS_DATA` in the file `app/constants/constants.ts`.

### Beehiiv Email (Optional)

If you want to use Beehiiv as an email provider, follow along:

- Go to https://beehiiv.com
- Follow the instructions here to obtain an iframe URL for the subscribe form (https://www.beehiiv.com/support/article/12977090590487-creating-and-embedding-beehiiv-subscribe-forms).
- Ignore the iframe portion. The EMBED_URL should look like this `https://embeds.beehive.com/SOME_UUID_CODE?slim=true`.
- Paste the this whole EMBED_URL to your `.env.local` as `NEXT_PUBLIC_BEEHIIV_EMBED_URL`

### Google Maps (Optional)

If you intend to use Google Maps on your listings, follow along, otherwise you can safely ignore the following:

- Go to https://console.cloud.google.com/projectselector2/home/dashboard
- Create a new project, give it a Project Name
- Go to https://console.cloud.google.com/apis/library/maps-embed-backend.googleapis.com Maps Embed API to enable the api key (its free for unlimited usage), click on 'Enable'
- Follow the onboarding flow. You will need a credit card - but the usage of the Maps Embed API is free (see here: https://mapsplatform.google.com/pricing/).
- Check all data and click "Start Free".
- You might need to have your credit card details verified.
- Once done: Copy your API KEY (and uncheck the checkbox for "Enable all Google Maps API for this account" and leave the other checkbox checked to get budget alerts (in case anything goes wrong - you will have $200 credits every month though))
- Paste the API Key to your env.local as `GOOGLE_MAPS_API_KEY`
- In the next window at google, it will ask you to protect your API key. For type, select "API restrictions" and for the API select "Maps Embed API". And confirm by clicking 'Rectrict Key'
- For me, there came an error message that the API is not valid or has not been enabled. Check here again to make sure Maps Embed Api is enabled: https://console.cloud.google.com/apis/library/maps-embed-backend.googleapis.com or check here under your api dashboard (https://console.cloud.google.com/apis/dashboard)

## Step 2. Run Next.js locally in development mode

We use pnpm for package management as it is a lot faster than npm. Head over to [pnpm.io](https://pnpm.io/) to install it. Alternatively, you can use npm instead of pnpm in the following code. You can, of course, also use any other package manager, such as bun.

```bash
pnpm install
```

## Step 3. Create the Database Structure

Let's connect Supabase with our local development project:

1. Install the Supabase CLI by following the instructions here: [Supabase CLI Getting Started](https://supabase.com/docs/guides/cli/getting-started).
2. In your IDE's terminal, run `npx supabase login`. It will say "Hello from Supabase! Press Enter to open browser and login automatically." So, press Enter. A browser window will log you in.
3. Next, run `npx supabase link` and choose the project you created. It will ask you for your **database password** which you created a couple of minutes ago (and hopefully remembered).
4. Next, run `npx supabase db push --linked --include-seed`. It will ask you: "Do you want to push these migrations to the remote database?
   • 20240701155049_initial_structure.sql" Answer Y. This will set up your database structure from the migration file we created for you.
5. Check here if your tables exist: [Table Editor](https://supabase.com/dashboard/project/_/editor).
6. Check here if your buckets exist: [Storage Buckets](https://supabase.com/dashboard/project/_/storage/buckets).
7. While you are in the storage buckets, drag and drop your default blog post images to `blog_images`. The default blog images are located in `public/img/blog/`. By default, there are 4 images (breaking-news, industry-news, og_1200x630, and placeholder.png). Upload your photos via the `Upload files` button or drag & drop them from your local folder (NOT from VS Code - this will not work).

If the tables or the storage buckets are not there and you have not received an error message, you can also just copy and paste the content of the files `20240701155049_initial_structure.sql` AND `seed.sql`, both in the **/supabase** folder, into the [SQL Editor](https://supabase.com/dashboard/project/_/sql/new).

## Step 4. Setup Authentication

We'll start with email and password authentication, but you can add any social logins yourself.

1. While you are in Supabase, head over to Email Templates: [Auth Templates](https://supabase.com/dashboard/project/_/auth/templates) and replace the current body of the **Confirm Signup** email template with the following:

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p>
	<a
		href="{{ .SiteURL }}/api/auth/confirm-hash?token_hash={{ .TokenHash }}&type=signup"
		>Confirm your mail</a
	>
</p>
```

## Step 5. See your website in action

In your terminal run

```bash
npm run dev
```

Your directory should be up and running on [http://localhost:3000](http://localhost:3000)!

You will see some warnings on the landing page, but this is just because we don't have any content yet.

## Step 6. Create Yourself as a User & Another User for Your Bots

1. In the navbar, click on `Account` (the user icon) and you will be redirected to the login page.
2. Click `Sign Up` and in the new window, enter your email address and a password (or whatever other authentication you have chosen).
3. You'll need to verify your email with the code they've sent you. (If you have not set up Resend, the email will come from 'noreply@mail.app.supabase.io')
4. When you run the app in localhost, there will be an `Admin Button` in the top navigation - but it won't work yet.
5. Head over to supabase.com, log in, select your project, head over to `Table Editor`, select `users`, and see if you created yourself as a user. Now, manually change `is_super_admin` from `FALSE` to `TRUE`. This way, your app knows that you are the super admin.
6. While you are here, copy your own `id` (the UUID in the first cell, right-click on the cell, and press 'copy cell content'). Head over to `app/_constants/constants.ts` and enter it as the `BOT_USER_ID`. This way, activities by a CRON job will be associated with your account. (Of course, you can also create another user and take their UUID if you want to have stuff separated and a bit more secure.)
7. Return to localhost:3000 and click the 'Admin' button.
8. Welcome to your Admin Dashboard, which should show a lot of 0s and a single 1 under Admins.

If you are on the Standard or Pro template: In the left sidebar, click on 'Activities' and see that there is a new activity: the creation of your account!

If you feel clicking a button in the admin area is a bit slow, you are correct. Every button press and function that is triggered will re-check if you are really the admin. The website itself that users will see will load instantly!

## Step 7. Let the Platform and Your Visitors Know What This Is All About

- Head over to the settings file `app/_constants/constants.ts` and answer the questions by filling out the necessary data. You should fill everything out and not delete any item. For example, if you don't have a Twitter account, I'd suggest that you make one or leave the field empty. Deleting the field might break something somewhere else in the code.
- This step is also important to let the AI (if you want to use it) know what your company is all about!

## Step 8. Brainstorm and Add Tags & Categories

1. Brainstorm about how your directory clusters the listings. Each listing can have one category and multiple tags associated with it.
2. Head over to your app, log in, and press the `Admin` button in the top navigation.
3. Head to `Categories` or `Tags` and enter all your categories and tags.

## Step 9. Add Your First Listing

Now, it is time to create your first listing.
Make sure to have defined at least 1 category and 1 tag.

- In the top navigation in `/account`, there is a button `+ New Listing`.
- Click on it and fill out the form.

  - **Title**: This is the title and will be the base for the slug.
  - **Description**: This is a [markdown](https://www.markdownguide.org/)-supported textarea.
  - **Excerpt**: This will be shown as a sneak preview to the listing as well as in the SEO SERP, so make sure it is SEO-optimized.
  - **Tags & Categories**: Choose one or multiple tags and the most fitting category. If you need more, head back to the `Category Manager` or `Tag Manager`.
  - **URL**: Enter a valid link that will be shown to users visiting the listing page. If you have purchased the version with AI content, there will be a button labeled 'Generate AI Description'. When set up, this will generate the listing's description and excerpt - but only when OpenAI knows about your listing. It will not actually go on the website. (This might change in the future, if requested.)
  - **Cover Image**: Upload a cover image, e.g., a screenshot of the website.

- Click on `Create`.
- Head back to `localhost:3000` and refresh the page. You should see your first listing on the front page because we revalidated the path by updating the listing!

Congratulations. Your first listing is (locally) online.

## Step 10. Make the platform visually yours

Create and update images & icons as described. Beware that nextjs in local development will not directly exchange images when you have changed them. You might need to restart your development server to see the new images.

**Logos**:

- `public/logos/logo_for_dark.png` (Your logo, displayed when dark mode is active)
- `public/logos/logo_for_light.png` (Your logo, displayed when light mode is active)

**Icons**:

- `public/icons/icon-512.png` (Your icon in 512x512)
- `public/icons/icon-128.png` (Your icon in 128x128)
- `app/apple-icon.png` (Your icon in 190x190)
- `public/favicon.ico` && `app/icon.ico` (same file: .ico version of your icon in 48x48)

_Recommendation_: I am using Adobe Illustrator to design my SVG logos, go to [SvgToPng](https://svgtopng.com/) to convert them to a PNG and then use [Favicon.io](https://favicon.io/favicon-converter/) to create the other needed icon files. Just stick to the current naming convention - and not to the one Favicon.io provides.

**OpenGraph Images**:

- `public/img/og_1080x1080.png` (Image for Social Media in format 1080x1080)
- `public/img/og_1200x630.png` (Image for Social Media in format 1200x630)
- `public/img/og_1600x900.png` (Image for Social Media in format 1600x900)

**Other Images**:

- `public/img/placeholder.jpg` (Image used for backup when no other image is provided.)

_Recommendation_: I am using Adobe Express to quickly create secondary images like these.

**Color Scheme**:

To change the main color (red per default), head over to [ui.shadcn.com](https://ui.shadcn.com/themes), pick a color, click "copy code" and paste it into the `app/globals.css` replacing the current `@layer base {}`

## Step 11. Deploy to production

To deploy your local project to Vercel, push it to [GitHub](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github) and [import it to Vercel](https://vercel.com/new).

> [!IMPORTANT]  
> When you import your project on Vercel, make sure to click on `Environment Variables` and set them to match your `.env.local` file with 1 exception: set `NODE_ENV` to `production`.

## Step 12. Check the Legal Work Before Launching Your New Directory

- It should be clear: I am not a lawyer, so I am not warranting or guaranteeing the correctness of the provided legal documents, which serve only as a guide. Talk to an actual lawyer to be on the safe-side.
- Make sure you have set up a company if you want to make money with the directory.
