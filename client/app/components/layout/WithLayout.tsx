import { AppContextProvider } from 'context/AppContextProvider';
import { FunctionComponent } from 'react';

import { IAppContext } from '../../context/AppContextProvider';

import Layout from './Layout';

export const withLayout = <T extends Record<string, unknown> & IAppContext>(
	Component: FunctionComponent<T>
) => {
	return function withLayoutComponent(props: T): JSX.Element {
		return (
			<AppContextProvider menu={props.menu} firstCategory={props.firstCategory}>
				<Layout>
					<Component {...props} />
				</Layout>
			</AppContextProvider>
		);
	};
};
