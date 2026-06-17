import HeadlineLink from '@/ui/HeadlineLink';

/**
 * Custom MDX components that are used in the blog.
 */
export const CUSTOM_MDX_COMPONENTS = {
	h1: (props: any) => <HeadlineLink hLevel={1} text={props.children} />,
	h2: (props: any) => <HeadlineLink hLevel={2} text={props.children} />,
	h3: (props: any) => <HeadlineLink hLevel={3} text={props.children} />,
	h4: (props: any) => <HeadlineLink hLevel={4} text={props.children} />,
	h5: (props: any) => <HeadlineLink hLevel={5} text={props.children} />,
	h6: (props: any) => <HeadlineLink hLevel={6} text={props.children} />,
};
