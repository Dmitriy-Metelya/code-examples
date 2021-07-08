import React from 'react';
import PropTypes from 'prop-types';

import SearchEoEmailTemplatesInput from './SearchEoEmailTemplatesInput';
import DeleteEoEmailTemplatesButton from './DeleteEoEmailTemplatesButton';
import AddEoEmailTemplateButton from './AddEoEmailTemplateButton';

import { filtersSpec, defaultFilters } from './filtersSpec';

import DataFilter from 'components_linkio/DataFilter';

import './eoEmailTemplatesBulkActions.scss';

const EoEmailTemplatesBulkActionsComponent = ({
  brandsOptions,
  hideDataFilter,
  hasEoEmailTemplates,
  usersOptions,
}) => {
  const eoEmailTemplatesFilterUsersOptions = {
    field: 'user',
    options: usersOptions,
  };

  const eoEmailTemplatesFilterBrandsOptions = {
    field: 'brand',
    options: brandsOptions,
  };

  return (
    <div className="eo-email-templates-bulk-actions">
      <div className="eo-email-templates-bulk-actions__row">
        <div className="eo-email-templates-bulk-actions__row-item">
          <SearchEoEmailTemplatesInput />
          {!hideDataFilter && (
            <>
              <span className="vertical-separator" />
              <DataFilter
                defaultFilters={defaultFilters([
                  eoEmailTemplatesFilterUsersOptions,
                  eoEmailTemplatesFilterBrandsOptions,
                ])}
                filtersSpec={filtersSpec([
                  eoEmailTemplatesFilterUsersOptions,
                  eoEmailTemplatesFilterBrandsOptions,
                ])}
                eqIsDefaultPredicate
              />
            </>
          )}

          {hasEoEmailTemplates && (
            <>
              <span className="vertical-separator" />
              <DeleteEoEmailTemplatesButton />
            </>
          )}
        </div>

        <div className="eo-email-templates-bulk-actions__row-item">
          <AddEoEmailTemplateButton />
        </div>
      </div>
    </div>
  );
};

EoEmailTemplatesBulkActionsComponent.propTypes = {
  brandsOptions: PropTypes.arrayOf(PropTypes.shape),
  hasEoEmailTemplates: PropTypes.bool,
  hideDataFilter: PropTypes.bool,
  usersOptions: PropTypes.arrayOf(PropTypes.shape),
};

export default EoEmailTemplatesBulkActionsComponent;
