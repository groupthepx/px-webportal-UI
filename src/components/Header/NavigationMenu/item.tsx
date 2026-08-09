import { FC, useContext, useState } from 'react';

import { Badge, styled, useTheme } from '@mui/material';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

import { SidebarContext } from '@/contexts/SidebarContext';
import { NavbarItem } from '@/components/navbar';
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu
} from '@/components/dropdown';
import StartLive from '@/components/StartLive';

const MenuIcon = styled(ChevronDownIcon)(({ theme }) => ({
  width: 16,
  height: 16,
  flex: '0 0 auto',
  color: theme.colors.gray.main,
  transition: theme.transitions.create(['color', 'transform']),
  '.MuiButton-root:hover &, .MuiButton-root.Mui-focusVisible &': {
    color: theme.colors.primary.main
  }
}));

interface NavigationMenuItemProps {
  children?: React.ReactNode;
  active?: boolean;
  link?: string;
  action?: 'live';
  icon?: React.ElementType;
  badge?: string;
  name: string;
  isDropdownItem?: boolean;
}

const NavigationMenuItem: FC<NavigationMenuItemProps> = ({
  children,
  link,
  action,
  icon: Icon,
  badge,
  active = false,
  name,
  isDropdownItem = false
}) => {
  const { closeSidebar } = useContext(SidebarContext);
  const theme = useTheme();
  const [liveDialogOpen, setLiveDialogOpen] = useState(false);

  const openLiveDialog = () => {
    closeSidebar();
    setLiveDialogOpen(true);
  };

  if (isDropdownItem) {
    if (action === 'live') {
      return (
        <>
          <DropdownItem active={active} onClick={openLiveDialog}>
            <span className="name-wrapper">{name}</span>
            {badge === '' ? <Badge color="primary" variant="dot" /> : null}
          </DropdownItem>
          <StartLive open={liveDialogOpen} onOpenChange={setLiveDialogOpen} hideTrigger />
        </>
      );
    }

    return (
      <DropdownItem
        href={link}
        active={active}
        onClick={() => closeSidebar()}
      >
        <span className="name-wrapper">{name}</span>
        {badge === '' ? <Badge color="primary" variant="dot" /> : null}
      </DropdownItem>
    );
  }

  if (children) {
    return (
      <Dropdown>
        <DropdownButton
          sx={{
            color: active ? theme.colors.primary.main : theme.palette.text.primary,
            fontWeight: active ? 700 : 500,
            '&:hover, &.active': {
              color: theme.colors.primary.main,
              backgroundColor: theme.colors.alpha.black[5]
            }
          }}
        >
          {Icon && <Icon />}
          <span className="name-wrapper">{name}</span>
          <MenuIcon aria-hidden="true" />
          {badge === '' ? <Badge color="primary" variant="dot" /> : null}
        </DropdownButton>
        <DropdownMenu>{children}</DropdownMenu>
      </Dropdown>
    );
  }

  if (action === 'live') {
    return (
      <>
        <NavbarItem href="#" active={active} onClick={(event) => { event.preventDefault(); openLiveDialog(); }}>
          {Icon && <Icon />}
          <span className="name-wrapper">{name}</span>
          {badge === '' ? <Badge color="primary" variant="dot" /> : null}
        </NavbarItem>
        <StartLive open={liveDialogOpen} onOpenChange={setLiveDialogOpen} hideTrigger />
      </>
    );
  }

  return (
    <NavbarItem href={link} active={active} onClick={() => closeSidebar()}>
      {Icon && <Icon />}
      <span className="name-wrapper">{name}</span>
      {badge === '' ? <Badge color="primary" variant="dot" /> : null}
    </NavbarItem>
  );
};

export default NavigationMenuItem;
