import { withLayout } from 'components/layout/WithLayout';
import Button from 'components/ui/button/Button';
import Heading from 'components/ui/heading/Heading';
import { FC } from 'react';

import { IMenu } from '../../../interfaces/menu.interface';
import TextArea from '../../ui/textarea/TextArea';

const Home: FC = () => {
	return (
		<>
			<Button appearance="primary">adasdas</Button>
			<Button appearance="ghost" arrow="right">
				adasdas
			</Button>
			<Heading tag="h1">home</Heading>
			<TextArea/>
		</>
	);
};

export default Home;
