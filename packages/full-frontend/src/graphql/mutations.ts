/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAccount = /* GraphQL */ `
  mutation CreateAccount(
    $input: CreateAccountInput!
    $condition: ModelAccountConditionInput
  ) {
    createAccount(input: $input, condition: $condition) {
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
export const updateAccount = /* GraphQL */ `
  mutation UpdateAccount(
    $input: UpdateAccountInput!
    $condition: ModelAccountConditionInput
  ) {
    updateAccount(input: $input, condition: $condition) {
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
export const deleteAccount = /* GraphQL */ `
  mutation DeleteAccount(
    $input: DeleteAccountInput!
    $condition: ModelAccountConditionInput
  ) {
    deleteAccount(input: $input, condition: $condition) {
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
export const createBudget = /* GraphQL */ `
  mutation CreateBudget(
    $input: CreateBudgetInput!
    $condition: ModelBudgetConditionInput
  ) {
    createBudget(input: $input, condition: $condition) {
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
export const updateBudget = /* GraphQL */ `
  mutation UpdateBudget(
    $input: UpdateBudgetInput!
    $condition: ModelBudgetConditionInput
  ) {
    updateBudget(input: $input, condition: $condition) {
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
export const deleteBudget = /* GraphQL */ `
  mutation DeleteBudget(
    $input: DeleteBudgetInput!
    $condition: ModelBudgetConditionInput
  ) {
    deleteBudget(input: $input, condition: $condition) {
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
export const createEvent = /* GraphQL */ `
  mutation CreateEvent(
    $input: CreateEventInput!
    $condition: ModelEventConditionInput
  ) {
    createEvent(input: $input, condition: $condition) {
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
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent(
    $input: UpdateEventInput!
    $condition: ModelEventConditionInput
  ) {
    updateEvent(input: $input, condition: $condition) {
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
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent(
    $input: DeleteEventInput!
    $condition: ModelEventConditionInput
  ) {
    deleteEvent(input: $input, condition: $condition) {
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
export const createInputs = /* GraphQL */ `
  mutation CreateInputs(
    $input: CreateInputsInput!
    $condition: ModelInputsConditionInput
  ) {
    createInputs(input: $input, condition: $condition) {
      id
      age
      annualAssetReturnPercent
      annualInflationPercent
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
export const updateInputs = /* GraphQL */ `
  mutation UpdateInputs(
    $input: UpdateInputsInput!
    $condition: ModelInputsConditionInput
  ) {
    updateInputs(input: $input, condition: $condition) {
      id
      age
      annualAssetReturnPercent
      annualInflationPercent
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
export const deleteInputs = /* GraphQL */ `
  mutation DeleteInputs(
    $input: DeleteInputsInput!
    $condition: ModelInputsConditionInput
  ) {
    deleteInputs(input: $input, condition: $condition) {
      id
      age
      annualAssetReturnPercent
      annualInflationPercent
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
export const createAssets = /* GraphQL */ `
  mutation CreateAssets(
    $input: CreateAssetsInput!
    $condition: ModelAssetsConditionInput
  ) {
    createAssets(input: $input, condition: $condition) {
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
export const updateAssets = /* GraphQL */ `
  mutation UpdateAssets(
    $input: UpdateAssetsInput!
    $condition: ModelAssetsConditionInput
  ) {
    updateAssets(input: $input, condition: $condition) {
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
export const deleteAssets = /* GraphQL */ `
  mutation DeleteAssets(
    $input: DeleteAssetsInput!
    $condition: ModelAssetsConditionInput
  ) {
    deleteAssets(input: $input, condition: $condition) {
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
export const createSimulation = /* GraphQL */ `
  mutation CreateSimulation(
    $input: CreateSimulationInput!
    $condition: ModelSimulationConditionInput
  ) {
    createSimulation(input: $input, condition: $condition) {
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
export const updateSimulation = /* GraphQL */ `
  mutation UpdateSimulation(
    $input: UpdateSimulationInput!
    $condition: ModelSimulationConditionInput
  ) {
    updateSimulation(input: $input, condition: $condition) {
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
export const deleteSimulation = /* GraphQL */ `
  mutation DeleteSimulation(
    $input: DeleteSimulationInput!
    $condition: ModelSimulationConditionInput
  ) {
    deleteSimulation(input: $input, condition: $condition) {
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
