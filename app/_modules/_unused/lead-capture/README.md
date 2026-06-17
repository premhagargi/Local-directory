# Lead Capture Module

This module adds lead capturing functionality to your application, allowing users to submit inquiries on listings and enabling listing owners to manage received leads.

## Integration Steps

### 1. Ensure Compatibility with the Module System

Check if the key `paths` key in the file `tsconfig.json` includes the following value `"@/modules/*": ["app/_modules/*],`.
If not, add it.

### 2. Copy the Module

If the `lead-capture` folder does not already exist in your project's `app/_modules/` directory, move it there. Per default, from v1.1.5. it is located in `app/_modules/_unused/`. Earlier versions need to make a copy of the new template and derive the folder from there.

### 3. Install Dependencies

Run the following command to install the required package:

```bash
pnpm add @radix-ui/react-accordion
```

### 4. Run Supabase Migrations

Apply the migration scripts located in `app/_modules/lead-capture/db/migrations/` to your Supabase database. The easiest way is to copy and paste the contents of the three files into Supabase's SQL editor:

Direct Link: https://supabase.com/dashboard/project/_/sql/new

Afterwards, run the following command in the terminal to fetch the latest types:

```bash
npm run typegen
```

### 5. Update Shared Components

#### Accordion Component

Check if you have the file `Accordion.tsx` in the folder `app/_components/_ui`.
If not, move the file `Accordion.tsx` from `modules/lead-capture/TEMP` to `app/_components/_ui`.

#### Navbar_Protected

Add the following code to the constant `ACCOUNT_NAV_LINKS` in the file `Navbar_Protected.tsx` located in `app/_components/Navbar_Protected.tsx`.
The will add a link to the leads page for registered users.

```tsx

	{
		label: 'Leads',
		href: '/account/leads',
		icon: MessageCircleMoreIcon,
		needSuperAdmin: false,
		neededRolePermission: Permissions.MANAGE_LEADS,
	},
```

Next, update the icon import in the same file as follows:

```tsx
import {
	// other Icons
	MessageCircleMoreIcon,
} from 'lucide-react';
```

#### Sublisting Query

Navigate to the file `supabaseQueries.ts` in the folder `app/_lib` and check if the constant `sublistingsParams` already includes `finder_id`. If not, add `, finder_id` to the end of it.

### 6. Create New Pages

Create the folder `leads` in the location `app/(protected)/account`, so that you have a folder path as follows: `app/(protected)/account/leads`

Move the file `page.tsx` from `modules/lead-capture/TEMP` to the newly created folder `app/(protected)/account/leads`.

### 7. Using the Lead Form

Import the `EmbeddableLeadForm` component, as well as a helper function, into the file `app/(Public)/explore/[slug]/page.tsx` by adding the following imports:

```tsx
import { EmbeddableLeadForm } from '@/modules/lead-capture';
import getSublistingsByListingId from '@/actions/sublistings/getSublistingsByListingId'; // OPTIONAL IF YOU USE SUBLISTINGS, ELSE YOU CAN IGNORE
```

Then, call the above function (optional, as outlined) within the ListingPage function and above the render:

```tsx
const { data: sublistings } = await getSublistingsByListingId(listing.id);
```

Add the `EmbeddableLeadForm` within the rendered output of the page, for examples, just below the `div` encompassing the "LISTING INFORMATION". As mentioned above, `sublistings={sublistings}` can be set to `sublistings={undefined}` if you are not using sublistings.

```tsx
<div className="bg-white dark:bg-transparent text-dark-foreground dark:text-white rounded-xl col-span-1 space-y-4 p-4 mt-4">
	<h2 className="text-xl font-semibold">INTERESTED? CONTACT!</h2>
	<EmbeddableLeadForm
		listing={listing}
		sublistings={sublistings}
		sublisting={undefined}
		embedType="modal"
		buttonClassName="w-full"
	/>
</div>
```

### 8. Test it

Navigate to a listing where you are the owner. Click "Contact Us" and fill out the form. Once done, you should/will see a success message.
Now, navigate to `/account/leads`. You should/will see the lead you just filled out.

[!Important]
Only listing OWNERs (derived by the owner_id) will be able to see a listing's leads.

Explanation: In DirectoryStack we have two different ownership columns in the listing table: finder_id and owner_id. The listing creator gets the finder_id. If someone claims a listing, you currently have to manually - in supabase - put this person as the owner (by changing the listing's owner_id to that of a user). This will lead to a listing having the "Owner Badge" and that person taking over a listing. A feature that allows owner attribution through the admin panel is on the roadmap!

### 9. Celebrate

Congrats. You just implemented the Lead Capture Module.

### 10. Support

If anything does not quite work out of the box - write us an email: support@directorystack.com or head over to our [GitHub Issue Page](https://github.com/BoilerplateHQ/directorystack-pro/issues) and open a new issue.

## Notes & FAQ

### Deep Dive EmbeddableLeadForm

The `EmbeddableLeadForm` can be placed on a listing and/or on a sublisting. It takes the following props:

- A `listing` when you want to attach the `EmbeddableLeadForm` to a listing. Set `sublisting={undefined}`.
- A `sublisting` when you want to attach the `EmbeddableLeadForm` to a sublisting. Set `listing={undefined}` and `sublistings={undefined}`.
- An array of 'sublistings' when you either (1) use sublistings or (2) want the user to choose a sublisting while the `EmbeddableLeadForm` is attached to a listing. For example, a coach (listing) has three coaching packages (sublistings). If you want to attach the `EmbeddableLeadForm` to the listing but let the user choose the package (sublisting), you can get the sublistings attached to the listing from the database and add them as the `sublistings` prop.
  [!IMPORTANT]
  Do not provide data for both the listing and the sublisting.
  Do not provide data for both the sublisting and the sublistings.

- The owner (receiver of the lead) will depend on whether a `listing` or a `sublisting` is given as a prop. If both are given (**do not do this!**), the listing's owner will receive the lead.
- The `EmbeddableLeadForm` comes in three variants: `inline`, `sheet`, and `modal`. For the latter two, a button is rendered which will open the form in a modal or sheet, respectively.
