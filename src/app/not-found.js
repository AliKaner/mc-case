"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import ROUTES from "@/constants/routes";
import styles from "./not-found.module.scss";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push(ROUTES.HOME);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Sayfa Bulunamadı</h2>
        <p className={styles.description}>
          Aradığınız sayfa mevcut değil veya bir hata oluştu.
        </p>
        <div className={styles.actions}>
          <Button
            onClick={handleGoHome}
            variant="primary"
            text="Ana Sayfa'ya Dön"
            testId="not-found-home-button"
            ariaLabel="Ana Sayfa'ya Dön"
          />
        </div>
      </div>
    </div>
  );
}
