/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAccount = /* GraphQL */ `
  query GetAccount($id: ID!) {
    getAccount(id: $id) {
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
export const listAccounts = /* GraphQL */ `
  query ListAccounts(
    $filter: ModelAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        simulation
        taxAdvantaged
        contributionPercent
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getBudget = /* GraphQL */ `
  query GetBudget($id: ID!) {
    getBudget(id: $id) {
      id
      name
      startDate
      endDate
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
export const listBudgets = /* GraphQL */ `
  query ListBudgets(
    $filter: ModelBudgetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBudgets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        startDate
        endDate
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
      nextToken
    }
  }
`;
export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      name
      date
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
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        date
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
      nextToken
    }
  }
`;
export const getInputs = /* GraphQL */ `
  query GetInputs($id: ID!) {
    getInputs(id: $id) {
      id
      settings
      simulation
      createdAt
      updatedAt
    }
  }
`;
export const listInputs = /* GraphQL */ `
  query ListInputs(
    $filter: ModelInputsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInputs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        settings
        simulation
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAssets = /* GraphQL */ `
  query GetAssets($id: ID!) {
    getAssets(id: $id) {
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
export const listAssets = /* GraphQL */ `
  query ListAssets(
    $filter: ModelAssetsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAssets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getSimulation = /* GraphQL */ `
  query GetSimulation($id: ID!) {
    getSimulation(id: $id) {
      id
      name
      selected
      simulationData
      successPercent
      lastComputed
      user
      createdAt
      updatedAt
    }
  }
`;
export const listSimulations = /* GraphQL */ `
  query ListSimulations(
    $filter: ModelSimulationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSimulations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        selected
        simulationData
        successPercent
        lastComputed
        user
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const budgetsBySimulationId = /* GraphQL */ `
  query BudgetsBySimulationId(
    $simulation: String
    $sortDirection: ModelSortDirection
    $filter: ModelBudgetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    budgetsBySimulationId(
      simulation: $simulation
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        startDate
        endDate
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
      nextToken
    }
  }
`;
export const simulationsByUser = /* GraphQL */ `
  query SimulationsByUser(
    $user: String
    $sortDirection: ModelSortDirection
    $filter: ModelSimulationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    simulationsByUser(
      user: $user
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        selected
        simulationData
        successPercent
        lastComputed
        user
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
