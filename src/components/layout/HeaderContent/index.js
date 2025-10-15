"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../../common/Button";
import ROUTES from "../../../constants/routes";
import styles from "./HeaderContent.module.scss";

export const HeaderContent = ({ logo }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isOnNewPage = pathname === ROUTES.USERS.CREATE_USER;

  const handleButtonClick = () => {
    if (isOnNewPage) {
      router.push(ROUTES.USERS.GET_USERS);
    } else {
      router.push(ROUTES.USERS.CREATE_USER);
    }
  };

  const handleLogoClick = () => {
    router.push(ROUTES.USERS.GET_USERS);
  };

  const buttonText = isOnNewPage ? "Ana Sayfaya Dön" : "Yeni Kullanıcı Ekle";
  const buttonAriaLabel = isOnNewPage
    ? "Ana Sayfaya Dön"
    : "Yeni Kullanıcı Ekle";

  return (
    <div className={styles.headerContent}>
      <div className={styles.logoContainer} onClick={handleLogoClick}>
        <Image
          src={logo}
          alt="Mini Tiny City Logo"
          width={180}
          height={60}
          priority
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button
          text={buttonText}
          onClick={handleButtonClick}
          variant="secondary"
          size="sm"
          testId="header-action-button"
          ariaLabel={buttonAriaLabel}
          className={styles.headerButton}
        />
      </div>
    </div>
  );
};

export default HeaderContent;
