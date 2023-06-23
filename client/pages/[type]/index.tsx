import axios from 'axios';
import { withLayout } from 'components/layout/WithLayout';
import type { GetStaticProps, NextPage } from 'next';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { API } from '../../app/configs/api.config';
import { firstLevelMenu } from '../../app/helpers/helpers';
import { MenuItem } from '../../app/interfaces/menu.interface';

const Type: NextPage<TypeProps> = ({ menu, firstCategory }): JSX.Element => {
	return <div>type: {firstCategory}</div>;
};

export default withLayout(Type);

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: firstLevelMenu.map((m) => '/' + m.route),
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({
	params,
}: GetStaticPropsContext<ParsedUrlQuery>) => {
	const firstCategoryItem = firstLevelMenu.find(
		(m) => m.route === params?.type
	);
	if (!firstCategoryItem) {
		return {
			notFound: true,
		};
	}

	const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
		firstCategory: firstCategoryItem.id,
	});

	return {
		props: {
			menu,
			firstCategory: firstCategoryItem.id,
		},
	};
};

interface TypeProps extends Record<string, unknown> {
	menu: MenuItem[];
	firstCategory: number;
}
