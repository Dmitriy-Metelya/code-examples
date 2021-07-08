import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'lodash';

import EoEmailTemplatesBulkActionsComponent from './EoEmailTemplatesBulkActionsComponent';

import withQueryParams, { withQueryParamsPropTypes } from 'decorators/withQueryParams';

import ConnectStoreHOC from 'startup/connect_store_hoc';

import { eoEmailTemplatesSelector } from 'selectors/eoEmailTemplatesSelector';
import { eoEmailTemplatesList } from 'common/propTypesShapes/eoEmailTemplates';

import { fetchSimpleBrands } from 'api/simpleBrand';

import { optionsSelector } from 'selectors';
import { optionsList } from 'common/prop_types_shapes';

import { fetchUsersAsOptions } from 'api/user';

const EoEmailTemplatesBulkActionsContainer = ({
  immutableBrandsOptions,
  immutableUsersOptions,
  dispatch,
  eoEmailTemplates,
  queryParams,
}) => {
  const [fetchingState, setFetchingState] = React.useState('notFetching');

  React.useEffect(() => {
    async function fetchFilterOptions() {
      await fetchUsersAsOptions(dispatch);
      await fetchSimpleBrands(dispatch);

      setFetchingState('fetchingFinished');
    }

    setFetchingState('isFetching');

    fetchFilterOptions();
  }, [dispatch]);

  const hasEoEmailTemplates = eoEmailTemplates.size > 0;
  const isFetchingFilterOptions = fetchingState === 'isFetching';
  const hideDataFilter = (!queryParams.filters && !hasEoEmailTemplates) || isFetchingFilterOptions;

  const usersOptionsWithIdAsNum = immutableUsersOptions.toJS();
  const usersOptionsWithIdAsString = usersOptionsWithIdAsNum.map((option) => ({
    ...option,
    value: option.value.toString(),
  }));

  const brandsOptionsWithIdAsNum = immutableBrandsOptions.toJS();
  const brandsOptionsWithIdAsString = brandsOptionsWithIdAsNum.map((option) => ({
    ...option,
    value: option.value.toString(),
  }));

  return (
    <EoEmailTemplatesBulkActionsComponent
      brandsOptions={brandsOptionsWithIdAsString}
      hasEoEmailTemplates={hasEoEmailTemplates}
      hideDataFilter={hideDataFilter}
      usersOptions={usersOptionsWithIdAsString}
    />
  );
};

EoEmailTemplatesBulkActionsContainer.propTypes = {
  eoEmailTemplates: eoEmailTemplatesList,
  immutableBrandsOptions: optionsList,
  immutableUsersOptions: optionsList,
  ...withQueryParamsPropTypes,
};

function select(state) {
  const eoEmailTemplates = eoEmailTemplatesSelector(state);

  const options = optionsSelector(state);

  return {
    eoEmailTemplates,
    immutableBrandsOptions: options.get('brandsOptions'),
    immutableUsersOptions: options.get('usersOptions'),
  };
}

export default compose(
  withQueryParams,
  ConnectStoreHOC,
  connect(select),
)(EoEmailTemplatesBulkActionsContainer);
