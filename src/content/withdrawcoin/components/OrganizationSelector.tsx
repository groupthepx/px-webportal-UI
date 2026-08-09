import React, { useMemo, useCallback } from 'react';
import { Autocomplete, Avatar, Box, TextField } from '@mui/material';
import { OrganizationSelectorProps } from '../types';
import { OrganizationDetailModel } from '@/model/organization';
import { ASSETS, AUTOCOMPLETE_WIDTH, MESSAGES } from '../constants';

/**
 * OrganizationSelector Component
 * Component สำหรับเลือกบริษัท/องค์กร
 * ใช้ React.memo เพื่อป้องกัน unnecessary re-renders
 */
const OrganizationSelector: React.FC<OrganizationSelectorProps> = React.memo(
  ({ value, options, onChange, disabled = false }) => {
    // หา organization ที่ถูกเลือกจาก value
    const selectedOrganization = useMemo(() => {
      return options.find((item) => String(item.organization_id) === String(value)) || null;
    }, [options, value]);

    // จัดการการเปลี่ยนแปลงค่า
    const handleChange = useCallback(
      (_event: any, newValue: OrganizationDetailModel | null) => {
        const organizationId = newValue?.organization_id ? String(newValue.organization_id) : '';
        onChange(organizationId);
      },
      [onChange]
    );

    // Render option ในรายการ dropdown
    const renderOption = useCallback(
      (props: any, option: OrganizationDetailModel) => {
        const imageUrl = option.company_logo
          ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${option.company_logo}`
          : ASSETS.PLACEHOLDER_IMAGE;

        // แยก key ออกจาก props เพื่อใช้ key จาก option แทน
        const { key, ...otherProps } = props;

        return (
          <Box
            component="li"
            {...otherProps}
            key={String(option.organization_id)}
            display="flex"
            alignItems="flex-end"
            justifyContent="space-between"
          >
            <Avatar
              sx={{ mr: 1, width: 24, height: 24 }}
              src={imageUrl}
              alt={option.company_name}
            />
            {option.company_name}
          </Box>
        );
      },
      []
    );

    // Get option label
    const getOptionLabel = useCallback((option: OrganizationDetailModel) => {
      return option.company_name || '';
    }, []);

    return (
      <Autocomplete
        sx={{
          mt: 1,
          width: {
            xs: AUTOCOMPLETE_WIDTH.MOBILE,
            md: AUTOCOMPLETE_WIDTH.DESKTOP,
          },
          maxWidth: {
            xs: AUTOCOMPLETE_WIDTH.MOBILE,
            md: AUTOCOMPLETE_WIDTH.DESKTOP,
          },
        }}
        autoHighlight
        size="small"
        value={selectedOrganization}
        onChange={handleChange}
        getOptionLabel={getOptionLabel}
        options={options}
        renderOption={renderOption}
        disabled={disabled}
        isOptionEqualToValue={(option, value) =>
          option.organization_id === value?.organization_id
        }
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            placeholder={MESSAGES.SELECT_COMPANY_PLACEHOLDER}
            name="organization_id"
            label={MESSAGES.COMPANY_LABEL}
          />
        )}
      />
    );
  }
);

OrganizationSelector.displayName = 'OrganizationSelector';

export default OrganizationSelector;

