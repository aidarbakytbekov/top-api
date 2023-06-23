import axios from 'axios';
import { ProductModel } from 'interfaces/product.interface';
import { TopPageModel } from 'interfaces/top-page.interface';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import { FC } from 'react';

import { TopLevelCategory } from '../../../server/src/top-page/top-page.model';
import { withLayout } from '../../app/components/layout/WithLayout';
import TopPageComponent from '../../app/components/screens/top-page/TopPage.component';
import { API } from '../../app/configs/api.config';
import { firstLevelMenu } from '../../app/helpers/helpers';
import { MenuItem } from '../../app/interfaces/menu.interface';

const TopPage: FC<TopPageProps> = ({ firstCategory, page, products }) => {
	return (
		<>
			{page && products && (
				<>
					<Head>
						<title>{page.metaTitle}</title>
						<meta name="description" content={page.metaDescription} />
						<meta property="og:title" content={page.metaTitle} />
						<meta property="og:description" content={page.metaDescription} />
						<meta property="og:locale" content="article" />
					</Head>
					<TopPageComponent
						firstCategory={firstCategory}
						page={page}
						products={products}
					/>
				</>
			)}
		</> 
	);
};

export default withLayout(TopPage);

export const getStaticPaths: GetStaticPaths = async () => {
	let paths: string[] = [];
	for (const m of firstLevelMenu) {
		const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
			firstCategory: m.id,
		});
		paths = paths.concat(
			menu.flatMap((item) =>
				item.pages.map((page: any) => `/${m.route}/${page.alias}`)
			)
		);
	}
	return {
		paths,
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({
	params,
}: GetStaticPropsContext<ParsedUrlQuery>) => {
	if (!params) {
		return {
			notFound: true,
		};
	}
	const firstCategoryItem = firstLevelMenu.find((m) => m.route === params.type);
	if (!firstCategoryItem) {
		return {
			notFound: true,
		};
	}

	try {
		const { data: menu } = await axios.post<TopPageProps[]>(API.topPage.find, {
			firstCategory: firstCategoryItem.id,
		});
		if (!menu.length) {
			return {
				notFound: true,
			};
		}
		const { data: page } = await axios.get<TopPageModel>(
			`${API.topPage.byAlias}${params.alias}`
		);
		const { data: products } = await axios.post<ProductModel[]>(
			API.product.find,
			{
				category: page.category,
				limit: 10,
			}
		);

		return {
			props: {
				menu,
				firstCategory: firstCategoryItem.id,
				page,
				products,
			},
		};
	} catch (e) {
		return {
			notFound: true,
		};
	}
};

interface TopPageProps extends Record<string, unknown> {
	menu: MenuItem[];
	firstCategory: TopLevelCategory;
	page: TopPageModel;
	products: ProductModel[];
}
