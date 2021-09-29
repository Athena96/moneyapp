/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAccount = /* GraphQL */ `
  subscription OnCreateAccount {
    onCreateAccount {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAccount = /* GraphQL */ `
  subscription OnUpdateAccount {
    onUpdateAccount {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAccount = /* GraphQL */ `
  subscription OnDeleteAccount {
    onDeleteAccount {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onCreateBudget = /* GraphQL */ `
  subscription OnCreateBudget {
    onCreateBudget {
      id
      name
      startDate
      endDate
      categories {
        id
        name
        value
        type
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateBudget = /* GraphQL */ `
  subscription OnUpdateBudget {
    onUpdateBudget {
      id
      name
      startDate
      endDate
      categories {
        id
        name
        value
        type
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteBudget = /* GraphQL */ `
  subscription OnDeleteBudget {
    onDeleteBudget {
      id
      name
      startDate
      endDate
      categories {
        id
        name
        value
        type
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent {
    onCreateEvent {
      id
      name
      date
      account
      category {
        id
        name
        value
        type
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent {
    onUpdateEvent {
      id
      name
      date
      account
      category {
        id
        name
        value
        type
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent {
    onDeleteEvent {
      id
      name
      date
      account
      category {
        id
        name
        value
        type
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateInputs = /* GraphQL */ `
  subscription OnCreateInputs {
    onCreateInputs {
      id
      key
      value
      type
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateInputs = /* GraphQL */ `
  subscription OnUpdateInputs {
    onUpdateInputs {
      id
      key
      value
      type
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteInputs = /* GraphQL */ `
  subscription OnDeleteInputs {
    onDeleteInputs {
      id
      key
      value
      type
      createdAt
      updatedAt
    }
  }
`;
export const onCreateAssets = /* GraphQL */ `
  subscription OnCreateAssets {
    onCreateAssets {
      id
      ticker
      quantity
      hasIndexData
      account
      isCurrency
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAssets = /* GraphQL */ `
  subscription OnUpdateAssets {
    onUpdateAssets {
      id
      ticker
      quantity
      hasIndexData
      account
      isCurrency
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAssets = /* GraphQL */ `
  subscription OnDeleteAssets {
    onDeleteAssets {
      id
      ticker
      quantity
      hasIndexData
      account
      isCurrency
      createdAt
      updatedAt
    }
  }
`;
