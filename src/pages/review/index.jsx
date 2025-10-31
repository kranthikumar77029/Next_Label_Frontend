import { useState } from 'react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/button';
import styles from './styles.module.css';

const sampleImages = [
  { id: 'IMG_001.jpg', annotator: 'John', status: 'Pending', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&q=80' },
  { id: 'IMG_010.jpg', annotator: 'Priya', status: 'Pending', url: 'https://images.unsplash.com/photo-1520975682031-1f47a9a2ee04?w=1000&q=80' },
  { id: 'IMG_020.jpg', annotator: 'John', status: 'Rejected', url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1000&q=80' },
];

const Review = () => {
  const [project, setProject] = useState('Helmet Detection');
  const projects = ['Helmet Detection', 'Traffic Signs'];
  const [idx, setIdx] = useState(0);
  const [items, setItems] = useState(sampleImages);

  const current = items[idx];

  const approve = () => {
    setItems((arr) => arr.map((it, i) => (i === idx ? { ...it, status: 'Approved' } : it)));
  };
  const reject = () => {
    setItems((arr) => arr.map((it, i) => (i === idx ? { ...it, status: 'Rejected' } : it)));
  };

  return (
    <Layout
      pageTitle="Reviewer Panel"
      headerActions={
        <select className={styles.select} value={project} onChange={(e) => setProject(e.target.value)}>
          {projects.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      }
    >
      <div className={styles.container}>
        <div className={styles.headerBar}>
          <div className={styles.metaChips}>
            <span className={styles.chip}><i className="fi fi-rr-picture"></i> {current.id}</span>
            <span className={styles.chip}><i className="fi fi-rr-user"></i> {current.annotator}</span>
            <span className={`${styles.chip} ${styles[current.status.toLowerCase()]}`}>{current.status}</span>
          </div>
          <div className={styles.actionsRow}>
            <Button variant="danger" icon="fi-rr-cross" onClick={reject}>Reject</Button>
            <Button variant="primary" icon="fi-rr-check" onClick={approve}>Approve</Button>
          </div>
        </div>

        <div className={styles.imageBox}>
          <img className={styles.image} src={current.url} alt={current.id} crossOrigin="anonymous" />
        </div>

        <div className={styles.pagination}>
          <Button
            variant="secondary"
            icon="fi-rr-angle-left"
            disabled={idx === 0}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
          >
            Previous
          </Button>
          <div className={styles.counter}>{idx + 1} / {items.length}</div>
          <Button
            variant="secondary"
            icon="fi-rr-angle-right"
            disabled={idx === items.length - 1}
            onClick={() => setIdx((i) => Math.min(items.length - 1, i + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Review;
