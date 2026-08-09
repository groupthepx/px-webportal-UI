import { useEffect, useRef, useState } from 'react';

import {
  IconButton,
  Box,
  List,
  Divider,
  ListItemText,
  alpha,
  Popover,
  Tooltip,
  styled,
  useTheme,
  Avatar,
  ListItemButton
} from '@mui/material';
import internationalization from '../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import { FLAG_ENGLISH, FLAG_LAOS } from '@/constants/image';
import secureLocalStorage from "react-secure-storage";
const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  border-radius: ${theme.general.borderRadiusLg};
`
);

type LanguageCode = 'en' | 'la' ; // Add other language codes as needed


function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { t }  = useTranslation();
  const getLanguage = i18n.language;
  const theme = useTheme();



  const switchLanguage = ({ lng }: { lng: LanguageCode }) => {
    internationalization.changeLanguage(lng);
    secureLocalStorage.setItem('selectedLanguage', lng);
  };
  const ref = useRef<HTMLButtonElement | null>(null); // Updated type here
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };


  const isValidLanguageCode = (lng: string): lng is LanguageCode => {
    return ['en' , 'la'].includes(lng);
  };

  

  useEffect(() => {
    // Retrieve the selected language from local storage on component mount
    const selectedLanguage = secureLocalStorage.getItem('selectedLanguage') as string | null;
    if (selectedLanguage && isValidLanguageCode(selectedLanguage)) {
      switchLanguage({ lng: selectedLanguage });
    }
  }, []);

  return (
    <>
      <Tooltip arrow title={t('Language Switcher')}>
        <IconButtonWrapper
          color="secondary"
          ref={ref}
          onClick={handleOpen}
          sx={{
            mx: 1,
            background: alpha(theme.colors.error.main, 0.1),
            transition: `${theme.transitions.create(['background'])}`,
            color: theme.colors.error.main,

            '&:hover': {
              background: alpha(theme.colors.error.main, 0.2)
            }
          }}
        >
          {getLanguage === 'la' && <Avatar src={FLAG_LAOS} alt="Avatar" sx={{ width: 28, height: 28 }} />}
          {getLanguage === 'en' && <Avatar src={FLAG_ENGLISH} alt="Avatar" sx={{ width: 28, height: 28, }} />}

        </IconButtonWrapper>
      </Tooltip>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box
          sx={{
            maxWidth: 240
          }}
        >
          {/* <SectionHeading variant="body2" color="text.primary">
            {t('ປ່ຽນພາສາ')}
          </SectionHeading> */}
          <List
            sx={{
              p: 2,
              svg: {
                width: 26,
                mr: 1
              }
            }}
            component="nav"
          >

            <ListItemButton
              className={getLanguage === 'la' ? 'active' : ''}

              onClick={() => {
                switchLanguage({ lng: 'la' });
                handleClose();
              }}
            >
              <Avatar src={FLAG_LAOS} alt="Avatar" sx={{ width: 28, height: 28, }} />
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary={t('ລາວ')}
              />
            </ListItemButton>
            <ListItemButton
              className={
                getLanguage === 'en' || getLanguage === 'en' ? 'active' : ''

              }
              onClick={() => {
                switchLanguage({ lng: 'en' });
                handleClose();
              }}
            >
              <Avatar src={FLAG_ENGLISH} alt="Avatar" sx={{ width: 28, height: 28 }} />
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary={t('ອັງກິດ')}
              />
            </ListItemButton>

          </List>
          <Divider />

        </Box>
      </Popover>
    </>
  );
}

export default LanguageSwitcher;
