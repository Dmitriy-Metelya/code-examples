import { snakeCase } from 'lodash';
import { createFilter } from 'components_linkio/DataFilter/utils';
import { translate } from 'common/i18n';

const eoEmailTemplatesFilterSpec = ({ field = '', options = [] }) => ({
  property: {
    value: field,
    label: translate(`uiComponents.dataFilters.filter.eoEmailTemplates.${field}`),
  },
  predicate: {
    eq: options,
    eqAny: options,
    notEqAll: options,
    notEq: options,
  },
  mapToQuery(property, predicate, value) {
    const keyName = `${snakeCase(property)}_id_${snakeCase(predicate)}`;

    switch (predicate) {
      case 'eqAny':
        return {
          [keyName]: value.map(({ value: itemValue }) => itemValue),
        };
      case 'eq':
        return {
          [keyName]: value.value,
        };
      case 'notEqAll':
        return {
          [keyName]: value.map(({ value: itemValue }) => itemValue),
        };
      case 'notEq': {
        const modifiedKeyName = `${keyName}_or_null`;

        return {
          [modifiedKeyName]: value.value,
        };
      }
    }

    return {};
  },
  mapToFilter(queryProperty, queryValue = []) {
    const thisProperty = this.property.value;

    const keyPrefix = `${snakeCase(thisProperty)}_id`;

    switch (queryProperty) {
      case `${keyPrefix}_eq_any`: {
        const value = this.options.filter(({ value }) => queryValue.includes(value));
        return this.createFilter('eqAny', value);
      }
      case `${keyPrefix}_eq`: {
        const value = this.options.filter(({ value }) => value === queryValue)[0];
        return this.createFilter('eq', value);
      }
      case `${keyPrefix}_not_eq_all`: {
        const value = this.options.filter(({ value }) => queryValue.includes(value));
        return this.createFilter('notEqAll', value);
      }
      case `${keyPrefix}_not_eq_or_null`: {
        const value = this.options.filter(({ value }) => value === queryValue)[0];
        return this.createFilter('notEq', value);
      }
      default:
        return false;
    }
  },
  options,
  createFilter,
});

export const filtersSpec = (filtersOptions) =>
  filtersOptions.reduce(
    (acc, { field, options }) => ({
      ...acc,
      [field]: eoEmailTemplatesFilterSpec({ field, options }),
    }),
    {},
  );

export const defaultFilters = (defaultFiltersOptions) =>
  defaultFiltersOptions.map((defaultFilterOptions) =>
    eoEmailTemplatesFilterSpec(defaultFilterOptions).createFilter('eq', null),
  );
