import { FC } from 'react';

interface PageHeaderProps {
  textHeader: string;
}

/**
 * Legacy placeholder. Page navigation is now rendered once by LayoutProviders
 * through BackToPreviousButton so pages do not show duplicate back controls.
 */
const PageHeader: FC<PageHeaderProps> = () => null;

export default PageHeader;
