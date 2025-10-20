import styles from './NewsPage.module.css';
import Link from 'next/link';

async function getNews() {
  // We need to call our own API route
  const response = await fetch('http://localhost:3000/api/news', { cache: 'no-store' });
  if (!response.ok) return [];
  return await response.json();
}

export default async function NewsPage() {
  const articles = await getNews();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Esports News</h1>
      <div className={styles.articleList}>
        {articles.map((article, index) => (
          <a href={article.url} key={index} target="_blank" rel="noopener noreferrer" className={styles.articleCard}>
            <div className={styles.imageContainer}>
              {article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
            </div>
            <div className={styles.content}>
              <span className={styles.source}>{article.source.name}</span>
              <h2 className={styles.articleTitle}>{article.title}</h2>
              <p className={styles.description}>{article.description}</p>
              <span className={styles.date}>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}