'use client';

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type Ref
} from 'react';
import {
  alpha,
  Box,
  Button,
  ClickAwayListener,
  MenuItem as MuiMenuItem,
  Paper,
  Popper,
  styled,
  type ButtonProps,
  type MenuItemProps
} from '@mui/material';

interface DropdownContextValue {
  anchorEl: HTMLElement | null;
  open: boolean;
  openMenu: (element: HTMLElement) => void;
  closeMenu: () => void;
  clearCloseTimer: () => void;
  scheduleClose: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

const DropdownRoot = styled(Box)(() => ({
  display: 'inline-flex',
  position: 'relative'
}));

const DropdownButtonBase = styled(Button)(() => ({
  minHeight: 40,
  gap: 6,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '& > svg': {
    width: 16,
    height: 16,
    flex: '0 0 auto'
  }
}));

const DropdownPanel = styled(Paper)(({ theme }) => ({
  minWidth: 220,
  maxHeight: 360,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: theme.spacing(1),
  borderRadius: theme.general.borderRadiusSm,
  border: `1px solid ${alpha(theme.palette.common.black, 0.08)}`,
  boxShadow: theme.shadows[8],
  backgroundColor: theme.palette.background.paper
}));

function useDropdown(): DropdownContextValue {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('Dropdown components must be used inside <Dropdown>.');
  }

  return context;
}

export interface DropdownProps {
  children: ReactNode;
  className?: string;
}

export function Dropdown({ children, className }: DropdownProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setAnchorEl(null);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(closeMenu, 220);
  }, [clearCloseTimer, closeMenu]);

  const openMenu = useCallback(
    (element: HTMLElement) => {
      clearCloseTimer();
      setAnchorEl(element);
    },
    [clearCloseTimer]
  );

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  return (
    <DropdownContext.Provider
      value={{
        anchorEl,
        open: Boolean(anchorEl),
        openMenu,
        closeMenu,
        clearCloseTimer,
        scheduleClose
      }}
    >
      <DropdownRoot className={className}>{children}</DropdownRoot>
    </DropdownContext.Provider>
  );
}

export interface DropdownButtonProps extends ButtonProps {
  outline?: boolean;
}

export const DropdownButton = forwardRef<HTMLButtonElement, DropdownButtonProps>(
  function DropdownButton({ children, outline = false, onClick, onMouseEnter, onMouseLeave, ...props }, ref) {
    const { open, openMenu, closeMenu, scheduleClose, clearCloseTimer } = useDropdown();

    const assignRef = (element: HTMLButtonElement | null) => {
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = element;
      }
    };

    return (
      <DropdownButtonBase
        {...props}
        ref={assignRef}
        type="button"
        variant={outline ? 'outlined' : 'text'}
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : undefined}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;

          if (open) {
            closeMenu();
          } else {
            openMenu(event.currentTarget);
          }
        }}
        onMouseEnter={(event) => {
          clearCloseTimer();
          openMenu(event.currentTarget);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          scheduleClose();
          onMouseLeave?.(event);
        }}
      >
        {children}
      </DropdownButtonBase>
    );
  }
);

DropdownButton.displayName = 'DropdownButton';

export interface DropdownMenuProps {
  children: ReactNode;
  className?: string;
}

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  const { anchorEl, open, closeMenu, clearCloseTimer, scheduleClose } = useDropdown();

  if (!anchorEl) return null;

  return (
    <Popper
      anchorEl={anchorEl}
      className={className}
      placement="bottom-start"
      modifiers={[{ name: 'offset', options: { offset: [0, 4] } }]}
      open={open}
      style={{ zIndex: 1301 }}
    >
      <ClickAwayListener onClickAway={closeMenu}>
        <DropdownPanel onMouseEnter={clearCloseTimer} onMouseLeave={scheduleClose}>
          {children}
        </DropdownPanel>
      </ClickAwayListener>
    </Popper>
  );
}

export interface DropdownItemProps extends Omit<MenuItemProps, 'component'> {
  active?: boolean;
  href?: string;
}

export const DropdownItem = forwardRef<HTMLElement, DropdownItemProps>(
  function DropdownItem({ active = false, children, href, onClick, ...props }, ref) {
    const { closeMenu } = useDropdown();

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      onClick?.(event as never);
      if (!event.defaultPrevented) closeMenu();
    };

    return (
      <MuiMenuItem
        {...props}
        ref={ref as Ref<HTMLLIElement>}
        component={href ? 'a' : 'li'}
        href={href}
        selected={active}
        sx={(theme) => ({
          minHeight: 40,
          borderRadius: theme.general.borderRadiusSm,
          padding: theme.spacing(1, 1.5),
          color: active ? theme.colors.primary.main : theme.palette.text.primary,
          fontWeight: active ? 700 : 400,
          '&:hover, &:focus-visible': {
            backgroundColor: alpha(theme.colors.primary.main, 0.08),
            color: theme.colors.primary.main
          }
        })}
        onClick={handleClick as MenuItemProps['onClick']}
      >
        {children}
      </MuiMenuItem>
    );
  }
);

DropdownItem.displayName = 'DropdownItem';
