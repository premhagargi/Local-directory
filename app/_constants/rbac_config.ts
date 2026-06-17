// Roles Based Access Control (RBAC)

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
import { User2Icon, UserIcon } from 'lucide-react';

// This is the place where you can define the roles and permissions for your application.
// These are only the non-admin roles. The admin role is a special role and should not be selectable by the user.

/**  IMPORTANT:
 * 1) If you want to use RBAC, set the USE_RBAC to true in the general settings.
 * 2a) You need to use userServer with the parameter checkUser:true to use it in a file (server side)
 * const { user, error } = await serverAuth({ checkUser: true, ... other params you need });
 * 2b) Or on client side with const { userObject: user } = useClientAuth({other params you need});
 * */

export enum Roles {
	ROLE_A = 'ROLE_A',
	ROLE_B = 'ROLE_B',
	ROLE_C = 'ROLE_C',
	// Add other non-admin roles as needed
}

export enum Permissions {
	MANAGE_LISTING = 'MANAGE_LISTING',
	MANAGE_SUBLISTING = 'MANAGE_SUBLISTING',
	MANAGE_BLOG_POST = 'MANAGE_BLOG_POST',
	MANAGE_LEADS = 'MANAGE_LEADS',
	CREATE_LEADS = 'CREATE_LEADS',
	MANAGE_PROMOTIONS = 'MANAGE_PROMOTIONS',
	MANAGE_ACCOUNT_SETTINGS = 'MANAGE_ACCOUNT_SETTINGS',
	ACCESS_DASHBOARD = 'ACCESS_DASHBOARD',
	ACCESS_COUPON = 'ACCESS_COUPON',
	// Add other permissions as needed
	ACCESS_XYZ = 'ACCESS_XYZ',
}

export const rolePermissions: Record<Roles, Permissions[]> = {
	[Roles.ROLE_A]: [
		Permissions.MANAGE_BLOG_POST,
		Permissions.MANAGE_LISTING,
		Permissions.MANAGE_SUBLISTING,
		Permissions.MANAGE_LEADS,
		Permissions.MANAGE_PROMOTIONS,
		Permissions.MANAGE_ACCOUNT_SETTINGS,
		Permissions.ACCESS_DASHBOARD,
	],
	[Roles.ROLE_B]: [
		Permissions.MANAGE_ACCOUNT_SETTINGS,
		Permissions.ACCESS_DASHBOARD,
		Permissions.CREATE_LEADS,
		Permissions.ACCESS_COUPON,
	],
	// Add other role-permissions-relations as needed
	[Roles.ROLE_C]: [],
};

// Don't include admin here as it is a special role which should not be selectable by the user
export const signupOptions = [
	{
		title: 'Join as a Event Owner',
		description: 'I am looking to promote my events.',
		lucide_icon: UserIcon,
		internalCode: Roles.ROLE_A,
	},
	{
		title: 'Join as a ATTENDEE',
		description:
			'I am looking to access all event information, including coupons.',
		lucide_icon: User2Icon,
		internalCode: Roles.ROLE_B,
	},
	// Add other non-admin-roles as needed - which can be selected by the user
];

export function userHasPermission(
	userRole: Roles,
	permission: Permissions
): boolean {
	if (GENERAL_SETTINGS.USE_RBAC === false) return true;
	const permissions = rolePermissions[userRole] || [];
	return permissions.includes(permission);
}
