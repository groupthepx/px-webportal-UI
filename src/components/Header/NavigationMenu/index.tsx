import { Box, List, styled } from '@mui/material';

import NavigationMenuItem from './item';
import { getVisibleMenuItems, MenuItem } from './items';
import { usePathname } from "next/navigation";
import { useSession } from 'next-auth/react';
import { Navbar, NavbarSection } from '@/components/navbar';
import useCurrentMemberType from '@/hooks/useCurrentMemberType';

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    width: 100%;
    .MuiList-root {
      padding: 0;
      display: flex;
      flex-direction: row;
      
      .MuiList-root .MuiList-root .MuiListItem-root .MuiIconButton-root {
        font-weight: normal !important;
      }

      .MuiListItem-root {
        padding: 0 2px;
        justify-content: center;
        width: auto;

        &:last-child {
          margin-left: auto;
        }
    
        .MuiIconButton-root {
          display: flex;
          background-color: transparent;
          border-radius: ${theme.general.borderRadiusLg};
          justify-content: center;
          font-size: ${theme.typography.pxToRem(14)};
          padding: ${theme.spacing(1.4, 2)};
          position: relative;
          font-weight: bold;
          color: ${theme.colors.alpha.trueWhite[100]};

          .name-wrapper {
            transition: ${theme.transitions.create(['color'])};
          }

          .MuiBadge-root {
            position: absolute;
            right: 16px;
            top: 12px;

            .MuiBadge-badge {
              background: ${theme.colors.alpha.white[70]};
              color: ${theme.colors.alpha.black[100]};
              font-size: ${theme.typography.pxToRem(11)};
              font-weight: bold;
              text-transform: uppercase;
            }
          }
  
          .MuiSvgIcon-root {
            transition: ${theme.transitions.create(['color'])};
            font-size: ${theme.typography.pxToRem(24)};
            margin-right: ${theme.spacing(1)};
            color: ${theme.colors.alpha.trueWhite[50]};
          }

          &.active,
          &:hover {
            background-color: ${theme.colors.alpha.white[10]};

            .MuiSvgIcon-root {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }
      }
    }

    &.dropdown-submenu {
      .MuiList-root {
        flex-direction: column;
        align-items: stretch;
        gap: 2px;
      }

      .MuiMenuItem-root {
        width: 100%;
      }
    }
`
);

interface MatchPathOptions {
  path: string;
  end?: boolean; // Optional
}

const matchPath = ({ path: pathToMatch, end }: MatchPathOptions, currentPath: string) => {

  if (end) {

    return pathToMatch === currentPath;
  } else {


    return currentPath.startsWith(pathToMatch);
  }
};




const renderNavigationMenuItems = ({
  items,
  path,
  isDropdownItem = false
}: {
  items: MenuItem[];
  path: string;
  isDropdownItem?: boolean;
}): JSX.Element => {
  const renderedItems = items.reduce(
    (ev: JSX.Element[], item: MenuItem) =>
      reduceChildRoutes({ ev, item, path, isDropdownItem }),
    []
  );

  if (isDropdownItem) {
    return (
      <SubMenuWrapper className="dropdown-submenu">
        <List component="div">{renderedItems}</List>
      </SubMenuWrapper>
    );
  }

  return <NavbarSection>{renderedItems}</NavbarSection>;
};

const reduceChildRoutes = ({
  ev,
  path,
  item,
  isDropdownItem
}: {
  ev: JSX.Element[];
  path: string;
  item: MenuItem;
  isDropdownItem: boolean;
}): Array<JSX.Element> => {
  const key = item.name;

  const exactMatch = item.link ? !!matchPath({ path: item.link, end: true }, path) : false;

  const partialMatch = item.link
    ? !!matchPath({ path: item.link, end: false }, path)
    : Boolean(item.items?.some((child) => child.link && matchPath({ path: child.link, end: false }, path)));

  if (item.items) {
    // const partialMatch = item.link
    //   ? !!matchPath(
    //     {
    //       path: item.link,
    //       end: false
    //     },
    //     path
    //   )
    //   : false;

    ev.push(
      <NavigationMenuItem
        key={key}
        active={partialMatch ?? undefined}
        name={item.name ?? undefined}
        icon={item.icon ?? undefined}
        link={item.link ?? undefined}
        action={item.action}
        badge={item.badge ?? undefined}
    
      >
        {renderNavigationMenuItems({
          path,
          items: item.items,
          isDropdownItem: true
        })}
      </NavigationMenuItem>
    );
  } else {
    ev.push(
      <NavigationMenuItem
        key={key}
        active={exactMatch || partialMatch}
        name={item.name ?? undefined}
        link={item.link ?? undefined}
        action={item.action}
        badge={item.badge ?? undefined}
        isDropdownItem={isDropdownItem}
        icon={item.icon ?? undefined}
      />
    );
  }

  return ev;
};




function NavigationMenu() {

  const pathname = usePathname()
  const { status } = useSession();
  const { memberType } = useCurrentMemberType(status === 'authenticated');
  const visibleMenuItems = getVisibleMenuItems(status === 'authenticated', memberType);

  return (
    <>
      {visibleMenuItems.map((section, index) => (
        <Navbar key={`${section.heading}-${index}`}>
          {renderNavigationMenuItems({
            items: section.items,
            path: pathname
          })}
        </Navbar>
      ))}
    </>
  );
}

export default NavigationMenu;
