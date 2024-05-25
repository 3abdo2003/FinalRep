/* eslint-disable prettier/prettier */
import { GetServerSideProps } from 'next';
import { getTopOffers, getMostRated } from '../services/api';
import ProductList from '../components/ProductList';
import styles from '../styles/Home.module.css';

interface HomeProps {
  topOffers: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    topOffer?: boolean;
  }[];
  mostRated: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    topOffer?: boolean;
    averageRating: number;
  }[];
}

const Home: React.FC<HomeProps> = ({ topOffers, mostRated }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.section}>
          <h1 className={styles.title}>Top Offers</h1>
          <ProductList products={topOffers} />
        </section>
        <section className={styles.section}>
          <h1 className={styles.title}>Most Rated</h1>
          <ProductList products={mostRated} />
        </section>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const [topOffers, mostRated] = await Promise.all([getTopOffers(), getMostRated()]);
  return {
    props: {
      topOffers,
      mostRated,
    },
  };
};

export default Home;