import axios from 'axios';
import { withLayout } from 'components/layout/WithLayout';
import type { GetStaticProps, NextPage } from 'next';

import { MenuItem } from '../app/interfaces/menu.interface';

const Search: NextPage = (): JSX.Element => {
	return (
    <div>search</div>
  )
};

export default withLayout(Search);

export const getStaticProps: GetStaticProps = async () => {
	const firstCategory = 0;

	const { data: menu } = await axios.post<MenuItem[]>(
		`${process.env.NEXT_PUBLIC_DOMAIN}/api/top-page/find`,
		{
			firstCategory,
		}
	);

	return {
		props: {
			menu,
			firstCategory,
		},
	};
};
