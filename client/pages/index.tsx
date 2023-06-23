import axios from 'axios';
import { withLayout } from 'components/layout/WithLayout';
import type { GetStaticProps, NextPage } from 'next';

import Home from '@/components/screens/home/Home';

import { API } from '../app/configs/api.config';
import { MenuItem } from '../app/interfaces/menu.interface';

const HomePage: NextPage = (): JSX.Element => {
	return <Home />;
};

export default withLayout(HomePage);

export const getStaticProps: GetStaticProps = async () => {
	const firstCategory = 0;

	const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
		firstCategory,
	});

	return {
		props: {
			menu,
			firstCategory,
		},
	};
};
