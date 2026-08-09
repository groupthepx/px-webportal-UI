import { FC, ReactNode, useState, useContext } from 'react';

import { useRouter } from "next/navigation";
import clsx from 'clsx';


import PropTypes from 'prop-types';
import {
  Button,
  Tooltip,
  Badge,
  Collapse,
  ListItem,
  styled,
  TooltipProps,
  tooltipClasses
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandLessTwoToneIcon from '@mui/icons-material/ExpandLessTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import { SidebarContext } from '@/contexts/SidebarContext';
import StartLive from '@/components/StartLive';


interface SidebarMenuItemProps {
  children?: ReactNode;
  link?: string;
  action?: 'live';
  icon?: any;
  badge?: string;
  badgeTooltip?: string;
  open?: boolean;
  active?: boolean;
  name: string;
}
interface SidebarMenuItemProps {
  children?: React.ReactNode;
  active?: boolean;
  link?: string;
  action?: 'live';
  icon?: any;
  badge?: string;
  badgeTooltip?: string;
  open?: boolean;
  name: string;
}

interface TooltipWrapperProps extends TooltipProps {
  className?: string;
}


const TooltipWrapper = styled(({ className, ...props }: TooltipWrapperProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.black[100],
    color: theme.palette.getContrastText(theme.colors.alpha.black[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.black[100]
  }
}));

const SidebarMenuItem: FC<SidebarMenuItemProps> = ({
  children,
  link,
  action,
  icon: Icon,
  badge,
  badgeTooltip,
  open: openParent = false, // Default parameter
  active = false, // Default parameter
  name,
  ...rest
}) => {
  const [menuToggle, setMenuToggle] = useState<boolean>(Boolean(openParent));
  const { t } = useTranslation();
  const { closeSidebar } = useContext(SidebarContext);


  const router = useRouter();

  const [liveDialogOpen, setLiveDialogOpen] = useState(false);


  const toggleMenu = (): void => {
    setMenuToggle((Open) => !Open);
  };

  if (children) {
    return (
      <ListItem component="div" className="Mui-children" key={name} {...rest}>
        <Button
          sx={{ fontWeight: 'light' }}
          className={clsx({ active: menuToggle })}
          startIcon={Icon && <Icon />}
          endIcon={
            menuToggle ? <ExpandLessTwoToneIcon /> : <ExpandMoreTwoToneIcon />
          }
          onClick={toggleMenu}
        >
          {badgeTooltip ? (
            <TooltipWrapper title={badgeTooltip} arrow placement="right">
              {badge === '' ? (
                <Badge color="primary" variant="dot" />
              ) : (
                <Badge badgeContent={badge} />
              )}
            </TooltipWrapper>
          ) : badge === '' ? (
            <Badge color="primary" variant="dot" />
          ) : (
            <Badge badgeContent={badge} />
          )}
          {t(name)}
        </Button>
        <Collapse in={menuToggle}>{children}</Collapse>
      </ListItem>
    );
  }

  if (action === 'live') {
    return (
      <>
        <ListItem component="div" key={name} {...rest}>
          <Button
            sx={{ fontWeight: 'light' }}
            className={clsx({ active: active })}
            disableRipple
            onClick={() => {
              setLiveDialogOpen(true);
              closeSidebar();
            }}
            style={{ fontSize: '1.1em' }}
            startIcon={Icon && <Icon />}
          >
            {t(name)}
            {badgeTooltip ? (
              <TooltipWrapper title={badgeTooltip} arrow placement="right">
                {badge === '' ? <Badge color="primary" variant="dot" /> : <Badge badgeContent={badge} />}
              </TooltipWrapper>
            ) : badge === '' ? <Badge color="primary" variant="dot" /> : <Badge badgeContent={badge} />}
          </Button>
        </ListItem>
        <StartLive open={liveDialogOpen} onOpenChange={setLiveDialogOpen} hideTrigger />
      </>
    );
  }

  return (
    <ListItem component="div" key={name} {...rest}>
      <Button
        sx={{ fontWeight: 'light' }}
        className={clsx({ active: active })}
        disableRipple
  
        onClick={() => {
          router.push(`${link}`)
          closeSidebar()
        }}
        style={{
          fontSize: '1.1em'
        }}
        startIcon={Icon && <Icon />}
      >
        {t(name)}
        {badgeTooltip ? (
          <TooltipWrapper title={badgeTooltip} arrow placement="right">
            {badge === '' ? (
              <Badge color="primary" variant="dot" />
            ) : (
              <Badge badgeContent={badge} />
            )}
          </TooltipWrapper>
        ) : badge === '' ? (
          <Badge color="primary" variant="dot" />
        ) : (
          <Badge badgeContent={badge} />
        )}
      </Button>
    </ListItem>
  );
};

// SidebarMenuItem.propTypes = {
//   children: PropTypes.node,
//   active: PropTypes.bool,
//   link: PropTypes.string,
//   icon: PropTypes.elementType,
//   badge: PropTypes.string,
//   badgeTooltip: PropTypes.string,
//   open: PropTypes.bool,
//   name: PropTypes.string.isRequired
// };



export default SidebarMenuItem;
