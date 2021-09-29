/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateAccountInput = {
  id?: string | null,
  name?: string | null,
};

export type ModelAccountConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelAccountConditionInput | null > | null,
  or?: Array< ModelAccountConditionInput | null > | null,
  not?: ModelAccountConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type Account = {
  __typename: "Account",
  id: string,
  name?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateAccountInput = {
  id: string,
  name?: string | null,
};

export type DeleteAccountInput = {
  id: string,
};

export type CreateBudgetInput = {
  id?: string | null,
  name?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  categories?: Array< CategoryInput | null > | null,
};

export type CategoryInput = {
  id?: string | null,
  name?: string | null,
  value?: number | null,
  type?: CategoryTypes | null,
};

export enum CategoryTypes {
  Expense = "Expense",
  Income = "Income",
}


export type ModelBudgetConditionInput = {
  name?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  and?: Array< ModelBudgetConditionInput | null > | null,
  or?: Array< ModelBudgetConditionInput | null > | null,
  not?: ModelBudgetConditionInput | null,
};

export type Budget = {
  __typename: "Budget",
  id: string,
  name?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  categories?:  Array<Category | null > | null,
  createdAt: string,
  updatedAt: string,
};

export type Category = {
  __typename: "Category",
  id?: string | null,
  name?: string | null,
  value?: number | null,
  type?: CategoryTypes | null,
};

export type UpdateBudgetInput = {
  id: string,
  name?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  categories?: Array< CategoryInput | null > | null,
};

export type DeleteBudgetInput = {
  id: string,
};

export type CreateEventInput = {
  id?: string | null,
  name?: string | null,
  date?: string | null,
  account?: string | null,
  category?: CategoryInput | null,
};

export type ModelEventConditionInput = {
  name?: ModelStringInput | null,
  date?: ModelStringInput | null,
  account?: ModelStringInput | null,
  and?: Array< ModelEventConditionInput | null > | null,
  or?: Array< ModelEventConditionInput | null > | null,
  not?: ModelEventConditionInput | null,
};

export type Event = {
  __typename: "Event",
  id: string,
  name?: string | null,
  date?: string | null,
  account?: string | null,
  category?: Category | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateEventInput = {
  id: string,
  name?: string | null,
  date?: string | null,
  account?: string | null,
  category?: CategoryInput | null,
};

export type DeleteEventInput = {
  id: string,
};

export type CreateInputsInput = {
  id?: string | null,
  key?: string | null,
  value?: string | null,
  type?: string | null,
};

export type ModelInputsConditionInput = {
  key?: ModelStringInput | null,
  value?: ModelStringInput | null,
  type?: ModelStringInput | null,
  and?: Array< ModelInputsConditionInput | null > | null,
  or?: Array< ModelInputsConditionInput | null > | null,
  not?: ModelInputsConditionInput | null,
};

export type Inputs = {
  __typename: "Inputs",
  id: string,
  key?: string | null,
  value?: string | null,
  type?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateInputsInput = {
  id: string,
  key?: string | null,
  value?: string | null,
  type?: string | null,
};

export type DeleteInputsInput = {
  id: string,
};

export type CreateAssetsInput = {
  id?: string | null,
  ticker?: string | null,
  quantity?: number | null,
  hasIndexData?: number | null,
  account?: string | null,
  isCurrency?: number | null,
};

export type ModelAssetsConditionInput = {
  ticker?: ModelStringInput | null,
  quantity?: ModelFloatInput | null,
  hasIndexData?: ModelIntInput | null,
  account?: ModelStringInput | null,
  isCurrency?: ModelIntInput | null,
  and?: Array< ModelAssetsConditionInput | null > | null,
  or?: Array< ModelAssetsConditionInput | null > | null,
  not?: ModelAssetsConditionInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Assets = {
  __typename: "Assets",
  id: string,
  ticker?: string | null,
  quantity?: number | null,
  hasIndexData?: number | null,
  account?: string | null,
  isCurrency?: number | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateAssetsInput = {
  id: string,
  ticker?: string | null,
  quantity?: number | null,
  hasIndexData?: number | null,
  account?: string | null,
  isCurrency?: number | null,
};

export type DeleteAssetsInput = {
  id: string,
};

export type ModelAccountFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelAccountFilterInput | null > | null,
  or?: Array< ModelAccountFilterInput | null > | null,
  not?: ModelAccountFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelAccountConnection = {
  __typename: "ModelAccountConnection",
  items?:  Array<Account | null > | null,
  nextToken?: string | null,
};

export type ModelBudgetFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  and?: Array< ModelBudgetFilterInput | null > | null,
  or?: Array< ModelBudgetFilterInput | null > | null,
  not?: ModelBudgetFilterInput | null,
};

export type ModelBudgetConnection = {
  __typename: "ModelBudgetConnection",
  items?:  Array<Budget | null > | null,
  nextToken?: string | null,
};

export type ModelEventFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  date?: ModelStringInput | null,
  account?: ModelStringInput | null,
  and?: Array< ModelEventFilterInput | null > | null,
  or?: Array< ModelEventFilterInput | null > | null,
  not?: ModelEventFilterInput | null,
};

export type ModelEventConnection = {
  __typename: "ModelEventConnection",
  items?:  Array<Event | null > | null,
  nextToken?: string | null,
};

export type ModelInputsFilterInput = {
  id?: ModelIDInput | null,
  key?: ModelStringInput | null,
  value?: ModelStringInput | null,
  type?: ModelStringInput | null,
  and?: Array< ModelInputsFilterInput | null > | null,
  or?: Array< ModelInputsFilterInput | null > | null,
  not?: ModelInputsFilterInput | null,
};

export type ModelInputsConnection = {
  __typename: "ModelInputsConnection",
  items?:  Array<Inputs | null > | null,
  nextToken?: string | null,
};

export type ModelAssetsFilterInput = {
  id?: ModelIDInput | null,
  ticker?: ModelStringInput | null,
  quantity?: ModelFloatInput | null,
  hasIndexData?: ModelIntInput | null,
  account?: ModelStringInput | null,
  isCurrency?: ModelIntInput | null,
  and?: Array< ModelAssetsFilterInput | null > | null,
  or?: Array< ModelAssetsFilterInput | null > | null,
  not?: ModelAssetsFilterInput | null,
};

export type ModelAssetsConnection = {
  __typename: "ModelAssetsConnection",
  items?:  Array<Assets | null > | null,
  nextToken?: string | null,
};

export type CreateAccountMutationVariables = {
  input: CreateAccountInput,
  condition?: ModelAccountConditionInput | null,
};

export type CreateAccountMutation = {
  createAccount?:  {
    __typename: "Account",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateAccountMutationVariables = {
  input: UpdateAccountInput,
  condition?: ModelAccountConditionInput | null,
};

export type UpdateAccountMutation = {
  updateAccount?:  {
    __typename: "Account",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteAccountMutationVariables = {
  input: DeleteAccountInput,
  condition?: ModelAccountConditionInput | null,
};

export type DeleteAccountMutation = {
  deleteAccount?:  {
    __typename: "Account",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateBudgetMutationVariables = {
  input: CreateBudgetInput,
  condition?: ModelBudgetConditionInput | null,
};

export type CreateBudgetMutation = {
  createBudget?:  {
    __typename: "Budget",
    id: string,
    name?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    categories?:  Array< {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateBudgetMutationVariables = {
  input: UpdateBudgetInput,
  condition?: ModelBudgetConditionInput | null,
};

export type UpdateBudgetMutation = {
  updateBudget?:  {
    __typename: "Budget",
    id: string,
    name?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    categories?:  Array< {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteBudgetMutationVariables = {
  input: DeleteBudgetInput,
  condition?: ModelBudgetConditionInput | null,
};

export type DeleteBudgetMutation = {
  deleteBudget?:  {
    __typename: "Budget",
    id: string,
    name?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    categories?:  Array< {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateEventMutationVariables = {
  input: CreateEventInput,
  condition?: ModelEventConditionInput | null,
};

export type CreateEventMutation = {
  createEvent?:  {
    __typename: "Event",
    id: string,
    name?: string | null,
    date?: string | null,
    account?: string | null,
    category?:  {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateEventMutationVariables = {
  input: UpdateEventInput,
  condition?: ModelEventConditionInput | null,
};

export type UpdateEventMutation = {
  updateEvent?:  {
    __typename: "Event",
    id: string,
    name?: string | null,
    date?: string | null,
    account?: string | null,
    category?:  {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteEventMutationVariables = {
  input: DeleteEventInput,
  condition?: ModelEventConditionInput | null,
};

export type DeleteEventMutation = {
  deleteEvent?:  {
    __typename: "Event",
    id: string,
    name?: string | null,
    date?: string | null,
    account?: string | null,
    category?:  {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateInputsMutationVariables = {
  input: CreateInputsInput,
  condition?: ModelInputsConditionInput | null,
};

export type CreateInputsMutation = {
  createInputs?:  {
    __typename: "Inputs",
    id: string,
    key?: string | null,
    value?: string | null,
    type?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateInputsMutationVariables = {
  input: UpdateInputsInput,
  condition?: ModelInputsConditionInput | null,
};

export type UpdateInputsMutation = {
  updateInputs?:  {
    __typename: "Inputs",
    id: string,
    key?: string | null,
    value?: string | null,
    type?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteInputsMutationVariables = {
  input: DeleteInputsInput,
  condition?: ModelInputsConditionInput | null,
};

export type DeleteInputsMutation = {
  deleteInputs?:  {
    __typename: "Inputs",
    id: string,
    key?: string | null,
    value?: string | null,
    type?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateAssetsMutationVariables = {
  input: CreateAssetsInput,
  condition?: ModelAssetsConditionInput | null,
};

export type CreateAssetsMutation = {
  createAssets?:  {
    __typename: "Assets",
    id: string,
    ticker?: string | null,
    quantity?: number | null,
    hasIndexData?: number | null,
    account?: string | null,
    isCurrency?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateAssetsMutationVariables = {
  input: UpdateAssetsInput,
  condition?: ModelAssetsConditionInput | null,
};

export type UpdateAssetsMutation = {
  updateAssets?:  {
    __typename: "Assets",
    id: string,
    ticker?: string | null,
    quantity?: number | null,
    hasIndexData?: number | null,
    account?: string | null,
    isCurrency?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteAssetsMutationVariables = {
  input: DeleteAssetsInput,
  condition?: ModelAssetsConditionInput | null,
};

export type DeleteAssetsMutation = {
  deleteAssets?:  {
    __typename: "Assets",
    id: string,
    ticker?: string | null,
    quantity?: number | null,
    hasIndexData?: number | null,
    account?: string | null,
    isCurrency?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetAccountQueryVariables = {
  id: string,
};

export type GetAccountQuery = {
  getAccount?:  {
    __typename: "Account",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListAccountsQueryVariables = {
  filter?: ModelAccountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAccountsQuery = {
  listAccounts?:  {
    __typename: "ModelAccountConnection",
    items?:  Array< {
      __typename: "Account",
      id: string,
      name?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetBudgetQueryVariables = {
  id: string,
};

export type GetBudgetQuery = {
  getBudget?:  {
    __typename: "Budget",
    id: string,
    name?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    categories?:  Array< {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListBudgetsQueryVariables = {
  filter?: ModelBudgetFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBudgetsQuery = {
  listBudgets?:  {
    __typename: "ModelBudgetConnection",
    items?:  Array< {
      __typename: "Budget",
      id: string,
      name?: string | null,
      startDate?: string | null,
      endDate?: string | null,
      categories?:  Array< {
        __typename: "Category",
        id?: string | null,
        name?: string | null,
        value?: number | null,
        type?: CategoryTypes | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetEventQueryVariables = {
  id: string,
};

export type GetEventQuery = {
  getEvent?:  {
    __typename: "Event",
    id: string,
    name?: string | null,
    date?: string | null,
    account?: string | null,
    category?:  {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListEventsQueryVariables = {
  filter?: ModelEventFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEventsQuery = {
  listEvents?:  {
    __typename: "ModelEventConnection",
    items?:  Array< {
      __typename: "Event",
      id: string,
      name?: string | null,
      date?: string | null,
      account?: string | null,
      category?:  {
        __typename: "Category",
        id?: string | null,
        name?: string | null,
        value?: number | null,
        type?: CategoryTypes | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetInputsQueryVariables = {
  id: string,
};

export type GetInputsQuery = {
  getInputs?:  {
    __typename: "Inputs",
    id: string,
    key?: string | null,
    value?: string | null,
    type?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListInputsQueryVariables = {
  filter?: ModelInputsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListInputsQuery = {
  listInputs?:  {
    __typename: "ModelInputsConnection",
    items?:  Array< {
      __typename: "Inputs",
      id: string,
      key?: string | null,
      value?: string | null,
      type?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetAssetsQueryVariables = {
  id: string,
};

export type GetAssetsQuery = {
  getAssets?:  {
    __typename: "Assets",
    id: string,
    ticker?: string | null,
    quantity?: number | null,
    hasIndexData?: number | null,
    account?: string | null,
    isCurrency?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListAssetsQueryVariables = {
  filter?: ModelAssetsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAssetsQuery = {
  listAssets?:  {
    __typename: "ModelAssetsConnection",
    items?:  Array< {
      __typename: "Assets",
      id: string,
      ticker?: string | null,
      quantity?: number | null,
      hasIndexData?: number | null,
      account?: string | null,
      isCurrency?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateAccountSubscription = {
  onCreateAccount?:  {
    __typename: "Account",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAccountSubscription = {
  onUpdateAccount?:  {
    __typename: "Account",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAccountSubscription = {
  onDeleteAccount?:  {
    __typename: "Account",
    id: string,
    name?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateBudgetSubscription = {
  onCreateBudget?:  {
    __typename: "Budget",
    id: string,
    name?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    categories?:  Array< {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateBudgetSubscription = {
  onUpdateBudget?:  {
    __typename: "Budget",
    id: string,
    name?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    categories?:  Array< {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteBudgetSubscription = {
  onDeleteBudget?:  {
    __typename: "Budget",
    id: string,
    name?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    categories?:  Array< {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateEventSubscription = {
  onCreateEvent?:  {
    __typename: "Event",
    id: string,
    name?: string | null,
    date?: string | null,
    account?: string | null,
    category?:  {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateEventSubscription = {
  onUpdateEvent?:  {
    __typename: "Event",
    id: string,
    name?: string | null,
    date?: string | null,
    account?: string | null,
    category?:  {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteEventSubscription = {
  onDeleteEvent?:  {
    __typename: "Event",
    id: string,
    name?: string | null,
    date?: string | null,
    account?: string | null,
    category?:  {
      __typename: "Category",
      id?: string | null,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateInputsSubscription = {
  onCreateInputs?:  {
    __typename: "Inputs",
    id: string,
    key?: string | null,
    value?: string | null,
    type?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateInputsSubscription = {
  onUpdateInputs?:  {
    __typename: "Inputs",
    id: string,
    key?: string | null,
    value?: string | null,
    type?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteInputsSubscription = {
  onDeleteInputs?:  {
    __typename: "Inputs",
    id: string,
    key?: string | null,
    value?: string | null,
    type?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateAssetsSubscription = {
  onCreateAssets?:  {
    __typename: "Assets",
    id: string,
    ticker?: string | null,
    quantity?: number | null,
    hasIndexData?: number | null,
    account?: string | null,
    isCurrency?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAssetsSubscription = {
  onUpdateAssets?:  {
    __typename: "Assets",
    id: string,
    ticker?: string | null,
    quantity?: number | null,
    hasIndexData?: number | null,
    account?: string | null,
    isCurrency?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAssetsSubscription = {
  onDeleteAssets?:  {
    __typename: "Assets",
    id: string,
    ticker?: string | null,
    quantity?: number | null,
    hasIndexData?: number | null,
    account?: string | null,
    isCurrency?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
