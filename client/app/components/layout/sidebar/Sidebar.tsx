import { FC } from 'react';

import Logo from '../../ui/Logo';
import Menu from '../menu/Menu';

import styles from './Sidebar.module.scss';
import { ISidebar } from './sidebar.interface';
import cn from 'classnames';
import SearchInput from '../../ui/searchInput/SearchInput';

const Sidebar: FC<ISidebar> = ({ className, ...props }): JSX.Element => {
	return (
		<aside {...props} className={cn(className, styles.sidebar)}>
			<Logo className={styles.logo}/>
			<SearchInput/>
			<Menu />
		</aside>
	);
};

export default Sidebar;
