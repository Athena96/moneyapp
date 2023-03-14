/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAccount = /* GraphQL */ `
  subscription OnCreateAccount {
    onCreateAccount {
      id
      name
      simulation
      taxAdvantaged
      contributionPercent
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
      simulation
      taxAdvantaged
      contributionPercent
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
      simulation
      taxAdvantaged
      contributionPercent
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
      startAge
      endAge
      categories {
        id
        name
        value
      }
      simulation
      type
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
      startAge
      endAge
      categories {
        id
        name
        value
      }
      simulation
      type
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
      startAge
      endAge
      categories {
        id
        name
        value
      }
      simulation
      type
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
      age
      account
      category {
        id
        name
        value
      }
      simulation
      type
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
      age
      account
      category {
        id
        name
        value
      }
      simulation
      type
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
      age
      account
      category {
        id
        name
        value
      }
      simulation
      type
      createdAt
      updatedAt
    }
  }
`;
export const onCreateInputs = /* GraphQL */ `
  subscription OnCreateInputs {
    onCreateInputs {
      id
      age
      firstSignIn
      assetAllocation {
        startAllocations {
          equities
          bonds
          cash
        }
        endAllocations {
          equities
          bonds
          cash
        }
        glidePath
      }
      simulation
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateInputs = /* GraphQL */ `
  subscription OnUpdateInputs {
    onUpdateInputs {
      id
      age
      firstSignIn
      assetAllocation {
        startAllocations {
          equities
          bonds
          cash
        }
        endAllocations {
          equities
          bonds
          cash
        }
        glidePath
      }
      simulation
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteInputs = /* GraphQL */ `
  subscription OnDeleteInputs {
    onDeleteInputs {
      id
      age
      firstSignIn
      assetAllocation {
        startAllocations {
          equities
          bonds
          cash
        }
        endAllocations {
          equities
          bonds
          cash
        }
        glidePath
      }
      simulation
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
      simulation
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
      simulation
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
      simulation
      createdAt
      updatedAt
    }
  }
`;
export const onCreateSimulation = /* GraphQL */ `
  subscription OnCreateSimulation {
    onCreateSimulation {
      id
      name
      selected
      simulationData
      successPercent
      lastComputed
      user
      status
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateSimulation = /* GraphQL */ `
  subscription OnUpdateSimulation {
    onUpdateSimulation {
      id
      name
      selected
      simulationData
      successPercent
      lastComputed
      user
      status
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteSimulation = /* GraphQL */ `
  subscription OnDeleteSimulation {
    onDeleteSimulation {
      id
      name
      selected
      simulationData
      successPercent
      lastComputed
      user
      status
      createdAt
      updatedAt
    }
  }
`;
