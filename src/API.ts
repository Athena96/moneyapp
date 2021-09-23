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

export type CreateCategoryInput = {
  id?: string | null,
  name?: string | null,
  value?: number | null,
  type?: CategoryTypes | null,
};

export enum CategoryTypes {
  Expense = "Expense",
  Income = "Income",
}


export type ModelCategoryConditionInput = {
  name?: ModelStringInput | null,
  value?: ModelFloatInput | null,
  type?: ModelCategoryTypesInput | null,
  and?: Array< ModelCategoryConditionInput | null > | null,
  or?: Array< ModelCategoryConditionInput | null > | null,
  not?: ModelCategoryConditionInput | null,
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

export type ModelCategoryTypesInput = {
  eq?: CategoryTypes | null,
  ne?: CategoryTypes | null,
};

export type Category = {
  __typename: "Category",
  id: string,
  name?: string | null,
  value?: number | null,
  type?: CategoryTypes | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateCategoryInput = {
  id: string,
  name?: string | null,
  value?: number | null,
  type?: CategoryTypes | null,
};

export type DeleteCategoryInput = {
  id: string,
};

export type CreateBudgetInput = {
  id?: string | null,
  name?: string | null,
  startDate?: string | null,
  endDate?: string | null,
};

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

export type UpdateBudgetInput = {
  id: string,
  name?: string | null,
  startDate?: string | null,
  endDate?: string | null,
};

export type DeleteBudgetInput = {
  id: string,
};

export type CreateEventInput = {
  id?: string | null,
  name?: string | null,
  date?: string | null,
  account?: string | null,
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
};

export type DeleteEventInput = {
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

export type ModelCategoryFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  value?: ModelFloatInput | null,
  type?: ModelCategoryTypesInput | null,
  and?: Array< ModelCategoryFilterInput | null > | null,
  or?: Array< ModelCategoryFilterInput | null > | null,
  not?: ModelCategoryFilterInput | null,
};

export type ModelCategoryConnection = {
  __typename: "ModelCategoryConnection",
  items?:  Array<Category | null > | null,
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

export type CreateCategoryMutationVariables = {
  input: CreateCategoryInput,
  condition?: ModelCategoryConditionInput | null,
};

export type CreateCategoryMutation = {
  createCategory?:  {
    __typename: "Category",
    id: string,
    name?: string | null,
    value?: number | null,
    type?: CategoryTypes | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateCategoryMutationVariables = {
  input: UpdateCategoryInput,
  condition?: ModelCategoryConditionInput | null,
};

export type UpdateCategoryMutation = {
  updateCategory?:  {
    __typename: "Category",
    id: string,
    name?: string | null,
    value?: number | null,
    type?: CategoryTypes | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteCategoryMutationVariables = {
  input: DeleteCategoryInput,
  condition?: ModelCategoryConditionInput | null,
};

export type DeleteCategoryMutation = {
  deleteCategory?:  {
    __typename: "Category",
    id: string,
    name?: string | null,
    value?: number | null,
    type?: CategoryTypes | null,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
    } | null,
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

export type GetCategoryQueryVariables = {
  id: string,
};

export type GetCategoryQuery = {
  getCategory?:  {
    __typename: "Category",
    id: string,
    name?: string | null,
    value?: number | null,
    type?: CategoryTypes | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListCategoriesQueryVariables = {
  filter?: ModelCategoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCategoriesQuery = {
  listCategories?:  {
    __typename: "ModelCategoryConnection",
    items?:  Array< {
      __typename: "Category",
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
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
        id: string,
        name?: string | null,
        value?: number | null,
        type?: CategoryTypes | null,
        createdAt: string,
        updatedAt: string,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
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
        id: string,
        name?: string | null,
        value?: number | null,
        type?: CategoryTypes | null,
        createdAt: string,
        updatedAt: string,
      } | null,
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

export type OnCreateCategorySubscription = {
  onCreateCategory?:  {
    __typename: "Category",
    id: string,
    name?: string | null,
    value?: number | null,
    type?: CategoryTypes | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCategorySubscription = {
  onUpdateCategory?:  {
    __typename: "Category",
    id: string,
    name?: string | null,
    value?: number | null,
    type?: CategoryTypes | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCategorySubscription = {
  onDeleteCategory?:  {
    __typename: "Category",
    id: string,
    name?: string | null,
    value?: number | null,
    type?: CategoryTypes | null,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
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
      id: string,
      name?: string | null,
      value?: number | null,
      type?: CategoryTypes | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};