import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
	FC,
	ForwardedRef,
	Fragment,
	forwardRef,
	useRef,
	useState,
} from 'react';

import Tag from '@/components/ui/tag/Tag';

import { declOfNum } from '../../../helpers/declOfNum';
import { priceRu } from '../../../helpers/regexp';
import Button from '../button/Button';
import Card from '../card/Card';
import Rating from '../rating/Rating';
import Review from '../review/Review';
import ReviewForm from '../reviewForm/ReviewForm';

import styles from './Product.module.scss';
import { IProduct } from './product.interface';

const Product: FC<IProduct> = forwardRef(
	({ product, ...rest }, ref: ForwardedRef<HTMLDivElement>) => {
		const [isReviewOpened, setIsReviewOpened] = useState<boolean>(false);

		const variants = {
			visible: {
				opacity: 1,
				height: 'auto',
				transition: {
					duration: 0.3,
				},
			},
			hidden: {
				opacity: 0,
				height: 0,
			},
		};

		return (
			<div {...rest} ref={ref}>
				<Card className={styles.item}>
					<div className={styles.logo}>
						<Image
							width={70}
							height={70}
							src={process.env.NEXT_PUBLIC_DOMAIN + product.image}
							alt={product.title}
						/>
					</div>
					<div className={styles.title}>{product.title}</div>
					<div className={styles.price}>
						<span>{priceRu(product.price)} ₽</span>
						{product.oldPrice && (
							<Tag className={styles.oldPrice} color="green">
								{priceRu(product.price - product.oldPrice)}
							</Tag>
						)}
					</div>
					{product.credit ? (
						<div className={styles.credit}>
							{priceRu(product.credit)}
							<span className={styles.month}>₽/мес</span>
						</div>
					) : null}
					<div className={styles.rating}>
						<Rating rating={product.reviewAvg ?? product.initialRating} />
					</div>
					<div className={styles.tags}>
						{' '}
						{product.categories.map((c) => (
							<Tag key={c} color="ghost">
								{c}
							</Tag>
						))}
					</div>
					<div className={styles.priceTitle}>Цена</div>
					{product.credit ? (
						<div className={styles.creditTitle}>Кредит</div>
					) : null}
					<div className={styles.rateTitle}>
						{product.reviewCount}{' '}
						{declOfNum(product.reviewCount, ['отзыв', 'отзыва', 'отзывов'])}
					</div>
					<hr className={styles.hr} />
					<div className={styles.description}>{product.description}</div>
					<div className={styles.feature}>
						{product.characteristics.map((c) => (
							<div className={styles.characteristics} key={c.name}>
								<span className={styles.characteristicsName}>{c.name}</span>
								<span className={styles.characteristicsDots}></span>
								<span className={styles.characteristicsValue}>{c.value}</span>
							</div>
						))}
						<div className={styles.tags}>
							{product.tags.map((item) => (
								<Tag key={item} color="ghost">
									{item}
								</Tag>
							))}
						</div>
					</div>
					<div className={styles.advBlock}>
						{product.advantages && (
							<div className={styles.advantages}>
								<span>Преимущества</span>
								<div>{product.advantages}</div>
							</div>
						)}
						{product.disadvantages && (
							<div className={styles.disadvantages}>
								<span>Недостатки</span>
								<div>{product.disadvantages}</div>
							</div>
						)}
					</div>
					<hr className={styles.hr} />
					<div className={styles.actions}>
						<div className={styles.btns}>
							<Link href={product.link}>
								<a target="_blank">
									<Button appearance="primary">Подробнее</Button>
								</a>
							</Link>
							<Button
								onClick={() => setIsReviewOpened(!isReviewOpened)}
								appearance="ghost"
								arrow={isReviewOpened ? 'down' : 'right'}
							>
								Читать отзывы
							</Button>
						</div>
					</div>
				</Card>
				<AnimatePresence>
					{isReviewOpened && (
						<motion.div
							exit={{
								opacity: 0,
								height: 0,
								transition: {
									duration: 0.3,
								},
							}}
							animate={isReviewOpened ? 'visible' : 'hidden'}
							variants={variants}
							initial="hidden"
						>
							<Card color="blue" className={styles.reviews}>
								{product.reviews.length ? (
									product.reviews.map((r) => (
										<Fragment key={r._id}>
											<Review className={styles.review_item} review={r} />
											<hr className={styles.divider} />
										</Fragment>
									))
								) : (
									<div>Отзывов нет</div>
								)}
								<ReviewForm productId={product._id} />
							</Card>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	}
);

Product.displayName = 'Product';
const MotionProduct = motion(Product);

export default MotionProduct;
