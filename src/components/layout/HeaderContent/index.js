// Component: HeaderContent

// Imports
"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../../common/Button";
import { useIsMobile } from "../../../hooks/useWindowSize";
import ROUTES from "../../../constants/routes";
import styles from "./HeaderContent.module.scss";

// HeaderContent Component
export const HeaderContent = (props) => {
  // Props
  const { logo } = props;
  // States
  // Hooks
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  // Effects
  // Other functions

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

  // Conditional rendering based on screen size
  const getButtonContent = () => {
    if (isMobile) {
      return isOnNewPage ? "←" : "+";
    }
    return buttonText;
  };

  // Render
  return (
    <div className={styles.headerContent}>
      <div className={styles.logoContainer} onClick={handleLogoClick}>
        <Image
          src={logo}
          alt="mc-case-logo"
          width={180}
          height={60}
          priority
          fetchPriority="high"
          style={{
            width: "auto",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button
          text={getButtonContent()}
          onClick={handleButtonClick}
          variant="secondary"
          size="sm"
          testId="header-action-button"
          ariaLabel={buttonAriaLabel}
          className={`${styles.headerButton} ${
            isMobile ? styles.mobileButton : ""
          }`}
        />
      </div>
    </div>
  );
};

// Export
export default HeaderContent;
