
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Friendship
 * 
 */
export type Friendship = $Result.DefaultSelection<Prisma.$FriendshipPayload>
/**
 * Model Team
 * 
 */
export type Team = $Result.DefaultSelection<Prisma.$TeamPayload>
/**
 * Model TeamMember
 * 
 */
export type TeamMember = $Result.DefaultSelection<Prisma.$TeamMemberPayload>
/**
 * Model TeamBan
 * 
 */
export type TeamBan = $Result.DefaultSelection<Prisma.$TeamBanPayload>
/**
 * Model TeamRequest
 * 
 */
export type TeamRequest = $Result.DefaultSelection<Prisma.$TeamRequestPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model FileItem
 * 
 */
export type FileItem = $Result.DefaultSelection<Prisma.$FileItemPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TeamType: {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
};

export type TeamType = (typeof TeamType)[keyof typeof TeamType]


export const TeamRole: {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
};

export type TeamRole = (typeof TeamRole)[keyof typeof TeamRole]


export const ProjectType: {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  GENRATED: 'GENRATED'
};

export type ProjectType = (typeof ProjectType)[keyof typeof ProjectType]


export const RequestStatus: {
  pending: 'pending',
  accepted: 'accepted',
  rejected: 'rejected'
};

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus]


export const FriendshipStatus: {
  pending: 'pending',
  accepted: 'accepted',
  blocked: 'blocked'
};

export type FriendshipStatus = (typeof FriendshipStatus)[keyof typeof FriendshipStatus]


export const NotificationType: {
  MESSAGE: 'MESSAGE',
  MENTION: 'MENTION',
  TEAM_INVITE: 'TEAM_INVITE',
  SYSTEM: 'SYSTEM',
  FRIENDSHIP: 'FRIENDSHIP'
};

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

}

export type TeamType = $Enums.TeamType

export const TeamType: typeof $Enums.TeamType

export type TeamRole = $Enums.TeamRole

export const TeamRole: typeof $Enums.TeamRole

export type ProjectType = $Enums.ProjectType

export const ProjectType: typeof $Enums.ProjectType

export type RequestStatus = $Enums.RequestStatus

export const RequestStatus: typeof $Enums.RequestStatus

export type FriendshipStatus = $Enums.FriendshipStatus

export const FriendshipStatus: typeof $Enums.FriendshipStatus

export type NotificationType = $Enums.NotificationType

export const NotificationType: typeof $Enums.NotificationType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.friendship`: Exposes CRUD operations for the **Friendship** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Friendships
    * const friendships = await prisma.friendship.findMany()
    * ```
    */
  get friendship(): Prisma.FriendshipDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.team`: Exposes CRUD operations for the **Team** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Teams
    * const teams = await prisma.team.findMany()
    * ```
    */
  get team(): Prisma.TeamDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.teamMember`: Exposes CRUD operations for the **TeamMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TeamMembers
    * const teamMembers = await prisma.teamMember.findMany()
    * ```
    */
  get teamMember(): Prisma.TeamMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.teamBan`: Exposes CRUD operations for the **TeamBan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TeamBans
    * const teamBans = await prisma.teamBan.findMany()
    * ```
    */
  get teamBan(): Prisma.TeamBanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.teamRequest`: Exposes CRUD operations for the **TeamRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TeamRequests
    * const teamRequests = await prisma.teamRequest.findMany()
    * ```
    */
  get teamRequest(): Prisma.TeamRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fileItem`: Exposes CRUD operations for the **FileItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FileItems
    * const fileItems = await prisma.fileItem.findMany()
    * ```
    */
  get fileItem(): Prisma.FileItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.0.1
   * Query Engine version: f09f2815f091dbba658cdcd2264306d88bb5bda6
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Friendship: 'Friendship',
    Team: 'Team',
    TeamMember: 'TeamMember',
    TeamBan: 'TeamBan',
    TeamRequest: 'TeamRequest',
    Project: 'Project',
    FileItem: 'FileItem',
    Message: 'Message',
    Notification: 'Notification'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "friendship" | "team" | "teamMember" | "teamBan" | "teamRequest" | "project" | "fileItem" | "message" | "notification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Friendship: {
        payload: Prisma.$FriendshipPayload<ExtArgs>
        fields: Prisma.FriendshipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FriendshipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FriendshipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          findFirst: {
            args: Prisma.FriendshipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FriendshipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          findMany: {
            args: Prisma.FriendshipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          create: {
            args: Prisma.FriendshipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          createMany: {
            args: Prisma.FriendshipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FriendshipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          delete: {
            args: Prisma.FriendshipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          update: {
            args: Prisma.FriendshipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          deleteMany: {
            args: Prisma.FriendshipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FriendshipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FriendshipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          upsert: {
            args: Prisma.FriendshipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          aggregate: {
            args: Prisma.FriendshipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFriendship>
          }
          groupBy: {
            args: Prisma.FriendshipGroupByArgs<ExtArgs>
            result: $Utils.Optional<FriendshipGroupByOutputType>[]
          }
          count: {
            args: Prisma.FriendshipCountArgs<ExtArgs>
            result: $Utils.Optional<FriendshipCountAggregateOutputType> | number
          }
        }
      }
      Team: {
        payload: Prisma.$TeamPayload<ExtArgs>
        fields: Prisma.TeamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findFirst: {
            args: Prisma.TeamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findMany: {
            args: Prisma.TeamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          create: {
            args: Prisma.TeamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          createMany: {
            args: Prisma.TeamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          delete: {
            args: Prisma.TeamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          update: {
            args: Prisma.TeamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          deleteMany: {
            args: Prisma.TeamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          upsert: {
            args: Prisma.TeamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          aggregate: {
            args: Prisma.TeamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeam>
          }
          groupBy: {
            args: Prisma.TeamGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamCountArgs<ExtArgs>
            result: $Utils.Optional<TeamCountAggregateOutputType> | number
          }
        }
      }
      TeamMember: {
        payload: Prisma.$TeamMemberPayload<ExtArgs>
        fields: Prisma.TeamMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          findFirst: {
            args: Prisma.TeamMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          findMany: {
            args: Prisma.TeamMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>[]
          }
          create: {
            args: Prisma.TeamMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          createMany: {
            args: Prisma.TeamMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>[]
          }
          delete: {
            args: Prisma.TeamMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          update: {
            args: Prisma.TeamMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          deleteMany: {
            args: Prisma.TeamMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamMemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>[]
          }
          upsert: {
            args: Prisma.TeamMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          aggregate: {
            args: Prisma.TeamMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeamMember>
          }
          groupBy: {
            args: Prisma.TeamMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamMemberCountArgs<ExtArgs>
            result: $Utils.Optional<TeamMemberCountAggregateOutputType> | number
          }
        }
      }
      TeamBan: {
        payload: Prisma.$TeamBanPayload<ExtArgs>
        fields: Prisma.TeamBanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamBanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamBanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamBanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamBanPayload>
          }
          findFirst: {
            args: Prisma.TeamBanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamBanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamBanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamBanPayload>
          }
          findMany: {
            args: Prisma.TeamBanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamBanPayload>[]
          }
          create: {
            args: Prisma.TeamBanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamBanPayload>
          }
          createMany: {
            args: Prisma.TeamBanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamBanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamBanPayload>[]
          }
          delete: {
            args: Prisma.TeamBanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamBanPayload>
          }
          update: {
            args: Prisma.TeamBanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamBanPayload>
          }
          deleteMany: {
            args: Prisma.TeamBanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamBanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamBanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamBanPayload>[]
          }
          upsert: {
            args: Prisma.TeamBanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamBanPayload>
          }
          aggregate: {
            args: Prisma.TeamBanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeamBan>
          }
          groupBy: {
            args: Prisma.TeamBanGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamBanGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamBanCountArgs<ExtArgs>
            result: $Utils.Optional<TeamBanCountAggregateOutputType> | number
          }
        }
      }
      TeamRequest: {
        payload: Prisma.$TeamRequestPayload<ExtArgs>
        fields: Prisma.TeamRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamRequestPayload>
          }
          findFirst: {
            args: Prisma.TeamRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamRequestPayload>
          }
          findMany: {
            args: Prisma.TeamRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamRequestPayload>[]
          }
          create: {
            args: Prisma.TeamRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamRequestPayload>
          }
          createMany: {
            args: Prisma.TeamRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamRequestPayload>[]
          }
          delete: {
            args: Prisma.TeamRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamRequestPayload>
          }
          update: {
            args: Prisma.TeamRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamRequestPayload>
          }
          deleteMany: {
            args: Prisma.TeamRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamRequestPayload>[]
          }
          upsert: {
            args: Prisma.TeamRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamRequestPayload>
          }
          aggregate: {
            args: Prisma.TeamRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeamRequest>
          }
          groupBy: {
            args: Prisma.TeamRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamRequestCountArgs<ExtArgs>
            result: $Utils.Optional<TeamRequestCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      FileItem: {
        payload: Prisma.$FileItemPayload<ExtArgs>
        fields: Prisma.FileItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileItemPayload>
          }
          findFirst: {
            args: Prisma.FileItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileItemPayload>
          }
          findMany: {
            args: Prisma.FileItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileItemPayload>[]
          }
          create: {
            args: Prisma.FileItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileItemPayload>
          }
          createMany: {
            args: Prisma.FileItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileItemPayload>[]
          }
          delete: {
            args: Prisma.FileItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileItemPayload>
          }
          update: {
            args: Prisma.FileItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileItemPayload>
          }
          deleteMany: {
            args: Prisma.FileItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FileItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileItemPayload>[]
          }
          upsert: {
            args: Prisma.FileItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileItemPayload>
          }
          aggregate: {
            args: Prisma.FileItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFileItem>
          }
          groupBy: {
            args: Prisma.FileItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileItemCountArgs<ExtArgs>
            result: $Utils.Optional<FileItemCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    friendship?: FriendshipOmit
    team?: TeamOmit
    teamMember?: TeamMemberOmit
    teamBan?: TeamBanOmit
    teamRequest?: TeamRequestOmit
    project?: ProjectOmit
    fileItem?: FileItemOmit
    message?: MessageOmit
    notification?: NotificationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    archieveProjects: number
    appsGenerated: number
    starredProjects: number
    projects: number
    teams: number
    teamJoinRequests: number
    teamBans: number
    sentMessages: number
    sentNotifications: number
    receivedNotifications: number
    deletedMessages: number
    friendshipsInitiated: number
    friendshipsReceived: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    archieveProjects?: boolean | UserCountOutputTypeCountArchieveProjectsArgs
    appsGenerated?: boolean | UserCountOutputTypeCountAppsGeneratedArgs
    starredProjects?: boolean | UserCountOutputTypeCountStarredProjectsArgs
    projects?: boolean | UserCountOutputTypeCountProjectsArgs
    teams?: boolean | UserCountOutputTypeCountTeamsArgs
    teamJoinRequests?: boolean | UserCountOutputTypeCountTeamJoinRequestsArgs
    teamBans?: boolean | UserCountOutputTypeCountTeamBansArgs
    sentMessages?: boolean | UserCountOutputTypeCountSentMessagesArgs
    sentNotifications?: boolean | UserCountOutputTypeCountSentNotificationsArgs
    receivedNotifications?: boolean | UserCountOutputTypeCountReceivedNotificationsArgs
    deletedMessages?: boolean | UserCountOutputTypeCountDeletedMessagesArgs
    friendshipsInitiated?: boolean | UserCountOutputTypeCountFriendshipsInitiatedArgs
    friendshipsReceived?: boolean | UserCountOutputTypeCountFriendshipsReceivedArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountArchieveProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAppsGeneratedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountStarredProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTeamsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamMemberWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTeamJoinRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTeamBansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamBanWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSentMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSentNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReceivedNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDeletedMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFriendshipsInitiatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendshipWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFriendshipsReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendshipWhereInput
  }


  /**
   * Count Type FriendshipCountOutputType
   */

  export type FriendshipCountOutputType = {
    messages: number
  }

  export type FriendshipCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | FriendshipCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * FriendshipCountOutputType without action
   */
  export type FriendshipCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendshipCountOutputType
     */
    select?: FriendshipCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FriendshipCountOutputType without action
   */
  export type FriendshipCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Count Type TeamCountOutputType
   */

  export type TeamCountOutputType = {
    members: number
    bannedUsers: number
    pendingRequests: number
    projects: number
    messages: number
    notifications: number
  }

  export type TeamCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | TeamCountOutputTypeCountMembersArgs
    bannedUsers?: boolean | TeamCountOutputTypeCountBannedUsersArgs
    pendingRequests?: boolean | TeamCountOutputTypeCountPendingRequestsArgs
    projects?: boolean | TeamCountOutputTypeCountProjectsArgs
    messages?: boolean | TeamCountOutputTypeCountMessagesArgs
    notifications?: boolean | TeamCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamCountOutputType
     */
    select?: TeamCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamMemberWhereInput
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountBannedUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamBanWhereInput
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountPendingRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamRequestWhereInput
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    starredBy: number
    files: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    starredBy?: boolean | ProjectCountOutputTypeCountStarredByArgs
    files?: boolean | ProjectCountOutputTypeCountFilesArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountStarredByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileItemWhereInput
  }


  /**
   * Count Type FileItemCountOutputType
   */

  export type FileItemCountOutputType = {
    children: number
  }

  export type FileItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | FileItemCountOutputTypeCountChildrenArgs
  }

  // Custom InputTypes
  /**
   * FileItemCountOutputType without action
   */
  export type FileItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItemCountOutputType
     */
    select?: FileItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FileItemCountOutputType without action
   */
  export type FileItemCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileItemWhereInput
  }


  /**
   * Count Type MessageCountOutputType
   */

  export type MessageCountOutputType = {
    notifications: number
    isDeletedBy: number
  }

  export type MessageCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notifications?: boolean | MessageCountOutputTypeCountNotificationsArgs
    isDeletedBy?: boolean | MessageCountOutputTypeCountIsDeletedByArgs
  }

  // Custom InputTypes
  /**
   * MessageCountOutputType without action
   */
  export type MessageCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageCountOutputType
     */
    select?: MessageCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MessageCountOutputType without action
   */
  export type MessageCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * MessageCountOutputType without action
   */
  export type MessageCountOutputTypeCountIsDeletedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    fullName: string | null
    email: string | null
    username: string | null
    password: string | null
    createdAt: Date | null
    avatar: string | null
    githubUrl: string | null
    bio: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    fullName: string | null
    email: string | null
    username: string | null
    password: string | null
    createdAt: Date | null
    avatar: string | null
    githubUrl: string | null
    bio: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    fullName: number
    email: number
    username: number
    password: number
    createdAt: number
    avatar: number
    githubUrl: number
    bio: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    username?: true
    password?: true
    createdAt?: true
    avatar?: true
    githubUrl?: true
    bio?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    username?: true
    password?: true
    createdAt?: true
    avatar?: true
    githubUrl?: true
    bio?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    username?: true
    password?: true
    createdAt?: true
    avatar?: true
    githubUrl?: true
    bio?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    fullName: string
    email: string
    username: string
    password: string | null
    createdAt: Date
    avatar: string | null
    githubUrl: string | null
    bio: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    username?: boolean
    password?: boolean
    createdAt?: boolean
    avatar?: boolean
    githubUrl?: boolean
    bio?: boolean
    archieveProjects?: boolean | User$archieveProjectsArgs<ExtArgs>
    appsGenerated?: boolean | User$appsGeneratedArgs<ExtArgs>
    starredProjects?: boolean | User$starredProjectsArgs<ExtArgs>
    projects?: boolean | User$projectsArgs<ExtArgs>
    teams?: boolean | User$teamsArgs<ExtArgs>
    teamJoinRequests?: boolean | User$teamJoinRequestsArgs<ExtArgs>
    teamBans?: boolean | User$teamBansArgs<ExtArgs>
    sentMessages?: boolean | User$sentMessagesArgs<ExtArgs>
    sentNotifications?: boolean | User$sentNotificationsArgs<ExtArgs>
    receivedNotifications?: boolean | User$receivedNotificationsArgs<ExtArgs>
    deletedMessages?: boolean | User$deletedMessagesArgs<ExtArgs>
    friendshipsInitiated?: boolean | User$friendshipsInitiatedArgs<ExtArgs>
    friendshipsReceived?: boolean | User$friendshipsReceivedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    username?: boolean
    password?: boolean
    createdAt?: boolean
    avatar?: boolean
    githubUrl?: boolean
    bio?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    username?: boolean
    password?: boolean
    createdAt?: boolean
    avatar?: boolean
    githubUrl?: boolean
    bio?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    fullName?: boolean
    email?: boolean
    username?: boolean
    password?: boolean
    createdAt?: boolean
    avatar?: boolean
    githubUrl?: boolean
    bio?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fullName" | "email" | "username" | "password" | "createdAt" | "avatar" | "githubUrl" | "bio", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    archieveProjects?: boolean | User$archieveProjectsArgs<ExtArgs>
    appsGenerated?: boolean | User$appsGeneratedArgs<ExtArgs>
    starredProjects?: boolean | User$starredProjectsArgs<ExtArgs>
    projects?: boolean | User$projectsArgs<ExtArgs>
    teams?: boolean | User$teamsArgs<ExtArgs>
    teamJoinRequests?: boolean | User$teamJoinRequestsArgs<ExtArgs>
    teamBans?: boolean | User$teamBansArgs<ExtArgs>
    sentMessages?: boolean | User$sentMessagesArgs<ExtArgs>
    sentNotifications?: boolean | User$sentNotificationsArgs<ExtArgs>
    receivedNotifications?: boolean | User$receivedNotificationsArgs<ExtArgs>
    deletedMessages?: boolean | User$deletedMessagesArgs<ExtArgs>
    friendshipsInitiated?: boolean | User$friendshipsInitiatedArgs<ExtArgs>
    friendshipsReceived?: boolean | User$friendshipsReceivedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      archieveProjects: Prisma.$ProjectPayload<ExtArgs>[]
      appsGenerated: Prisma.$ProjectPayload<ExtArgs>[]
      starredProjects: Prisma.$ProjectPayload<ExtArgs>[]
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      teams: Prisma.$TeamMemberPayload<ExtArgs>[]
      teamJoinRequests: Prisma.$TeamRequestPayload<ExtArgs>[]
      teamBans: Prisma.$TeamBanPayload<ExtArgs>[]
      sentMessages: Prisma.$MessagePayload<ExtArgs>[]
      sentNotifications: Prisma.$NotificationPayload<ExtArgs>[]
      receivedNotifications: Prisma.$NotificationPayload<ExtArgs>[]
      deletedMessages: Prisma.$MessagePayload<ExtArgs>[]
      friendshipsInitiated: Prisma.$FriendshipPayload<ExtArgs>[]
      friendshipsReceived: Prisma.$FriendshipPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fullName: string
      email: string
      username: string
      password: string | null
      createdAt: Date
      avatar: string | null
      githubUrl: string | null
      bio: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    archieveProjects<T extends User$archieveProjectsArgs<ExtArgs> = {}>(args?: Subset<T, User$archieveProjectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    appsGenerated<T extends User$appsGeneratedArgs<ExtArgs> = {}>(args?: Subset<T, User$appsGeneratedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    starredProjects<T extends User$starredProjectsArgs<ExtArgs> = {}>(args?: Subset<T, User$starredProjectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    projects<T extends User$projectsArgs<ExtArgs> = {}>(args?: Subset<T, User$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    teams<T extends User$teamsArgs<ExtArgs> = {}>(args?: Subset<T, User$teamsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    teamJoinRequests<T extends User$teamJoinRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$teamJoinRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    teamBans<T extends User$teamBansArgs<ExtArgs> = {}>(args?: Subset<T, User$teamBansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamBanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sentMessages<T extends User$sentMessagesArgs<ExtArgs> = {}>(args?: Subset<T, User$sentMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sentNotifications<T extends User$sentNotificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$sentNotificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    receivedNotifications<T extends User$receivedNotificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$receivedNotificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    deletedMessages<T extends User$deletedMessagesArgs<ExtArgs> = {}>(args?: Subset<T, User$deletedMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    friendshipsInitiated<T extends User$friendshipsInitiatedArgs<ExtArgs> = {}>(args?: Subset<T, User$friendshipsInitiatedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    friendshipsReceived<T extends User$friendshipsReceivedArgs<ExtArgs> = {}>(args?: Subset<T, User$friendshipsReceivedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly githubUrl: FieldRef<"User", 'String'>
    readonly bio: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.archieveProjects
   */
  export type User$archieveProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * User.appsGenerated
   */
  export type User$appsGeneratedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * User.starredProjects
   */
  export type User$starredProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * User.projects
   */
  export type User$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * User.teams
   */
  export type User$teamsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    where?: TeamMemberWhereInput
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    cursor?: TeamMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * User.teamJoinRequests
   */
  export type User$teamJoinRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestInclude<ExtArgs> | null
    where?: TeamRequestWhereInput
    orderBy?: TeamRequestOrderByWithRelationInput | TeamRequestOrderByWithRelationInput[]
    cursor?: TeamRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamRequestScalarFieldEnum | TeamRequestScalarFieldEnum[]
  }

  /**
   * User.teamBans
   */
  export type User$teamBansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanInclude<ExtArgs> | null
    where?: TeamBanWhereInput
    orderBy?: TeamBanOrderByWithRelationInput | TeamBanOrderByWithRelationInput[]
    cursor?: TeamBanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamBanScalarFieldEnum | TeamBanScalarFieldEnum[]
  }

  /**
   * User.sentMessages
   */
  export type User$sentMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * User.sentNotifications
   */
  export type User$sentNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.receivedNotifications
   */
  export type User$receivedNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.deletedMessages
   */
  export type User$deletedMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * User.friendshipsInitiated
   */
  export type User$friendshipsInitiatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    where?: FriendshipWhereInput
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    cursor?: FriendshipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * User.friendshipsReceived
   */
  export type User$friendshipsReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    where?: FriendshipWhereInput
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    cursor?: FriendshipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Friendship
   */

  export type AggregateFriendship = {
    _count: FriendshipCountAggregateOutputType | null
    _min: FriendshipMinAggregateOutputType | null
    _max: FriendshipMaxAggregateOutputType | null
  }

  export type FriendshipMinAggregateOutputType = {
    id: string | null
    initiatorId: string | null
    receiverId: string | null
    status: $Enums.FriendshipStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FriendshipMaxAggregateOutputType = {
    id: string | null
    initiatorId: string | null
    receiverId: string | null
    status: $Enums.FriendshipStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FriendshipCountAggregateOutputType = {
    id: number
    initiatorId: number
    receiverId: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FriendshipMinAggregateInputType = {
    id?: true
    initiatorId?: true
    receiverId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FriendshipMaxAggregateInputType = {
    id?: true
    initiatorId?: true
    receiverId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FriendshipCountAggregateInputType = {
    id?: true
    initiatorId?: true
    receiverId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FriendshipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Friendship to aggregate.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Friendships
    **/
    _count?: true | FriendshipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FriendshipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FriendshipMaxAggregateInputType
  }

  export type GetFriendshipAggregateType<T extends FriendshipAggregateArgs> = {
        [P in keyof T & keyof AggregateFriendship]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFriendship[P]>
      : GetScalarType<T[P], AggregateFriendship[P]>
  }




  export type FriendshipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendshipWhereInput
    orderBy?: FriendshipOrderByWithAggregationInput | FriendshipOrderByWithAggregationInput[]
    by: FriendshipScalarFieldEnum[] | FriendshipScalarFieldEnum
    having?: FriendshipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FriendshipCountAggregateInputType | true
    _min?: FriendshipMinAggregateInputType
    _max?: FriendshipMaxAggregateInputType
  }

  export type FriendshipGroupByOutputType = {
    id: string
    initiatorId: string
    receiverId: string
    status: $Enums.FriendshipStatus
    createdAt: Date
    updatedAt: Date
    _count: FriendshipCountAggregateOutputType | null
    _min: FriendshipMinAggregateOutputType | null
    _max: FriendshipMaxAggregateOutputType | null
  }

  type GetFriendshipGroupByPayload<T extends FriendshipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FriendshipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FriendshipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FriendshipGroupByOutputType[P]>
            : GetScalarType<T[P], FriendshipGroupByOutputType[P]>
        }
      >
    >


  export type FriendshipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    initiatorId?: boolean
    receiverId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    initiator?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    messages?: boolean | Friendship$messagesArgs<ExtArgs>
    _count?: boolean | FriendshipCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    initiatorId?: boolean
    receiverId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    initiator?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    initiatorId?: boolean
    receiverId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    initiator?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectScalar = {
    id?: boolean
    initiatorId?: boolean
    receiverId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FriendshipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "initiatorId" | "receiverId" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["friendship"]>
  export type FriendshipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    initiator?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    messages?: boolean | Friendship$messagesArgs<ExtArgs>
    _count?: boolean | FriendshipCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FriendshipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    initiator?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FriendshipIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    initiator?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FriendshipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Friendship"
    objects: {
      initiator: Prisma.$UserPayload<ExtArgs>
      receiver: Prisma.$UserPayload<ExtArgs>
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      initiatorId: string
      receiverId: string
      status: $Enums.FriendshipStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["friendship"]>
    composites: {}
  }

  type FriendshipGetPayload<S extends boolean | null | undefined | FriendshipDefaultArgs> = $Result.GetResult<Prisma.$FriendshipPayload, S>

  type FriendshipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FriendshipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FriendshipCountAggregateInputType | true
    }

  export interface FriendshipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Friendship'], meta: { name: 'Friendship' } }
    /**
     * Find zero or one Friendship that matches the filter.
     * @param {FriendshipFindUniqueArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FriendshipFindUniqueArgs>(args: SelectSubset<T, FriendshipFindUniqueArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Friendship that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FriendshipFindUniqueOrThrowArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FriendshipFindUniqueOrThrowArgs>(args: SelectSubset<T, FriendshipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Friendship that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindFirstArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FriendshipFindFirstArgs>(args?: SelectSubset<T, FriendshipFindFirstArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Friendship that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindFirstOrThrowArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FriendshipFindFirstOrThrowArgs>(args?: SelectSubset<T, FriendshipFindFirstOrThrowArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Friendships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Friendships
     * const friendships = await prisma.friendship.findMany()
     * 
     * // Get first 10 Friendships
     * const friendships = await prisma.friendship.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const friendshipWithIdOnly = await prisma.friendship.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FriendshipFindManyArgs>(args?: SelectSubset<T, FriendshipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Friendship.
     * @param {FriendshipCreateArgs} args - Arguments to create a Friendship.
     * @example
     * // Create one Friendship
     * const Friendship = await prisma.friendship.create({
     *   data: {
     *     // ... data to create a Friendship
     *   }
     * })
     * 
     */
    create<T extends FriendshipCreateArgs>(args: SelectSubset<T, FriendshipCreateArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Friendships.
     * @param {FriendshipCreateManyArgs} args - Arguments to create many Friendships.
     * @example
     * // Create many Friendships
     * const friendship = await prisma.friendship.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FriendshipCreateManyArgs>(args?: SelectSubset<T, FriendshipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Friendships and returns the data saved in the database.
     * @param {FriendshipCreateManyAndReturnArgs} args - Arguments to create many Friendships.
     * @example
     * // Create many Friendships
     * const friendship = await prisma.friendship.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Friendships and only return the `id`
     * const friendshipWithIdOnly = await prisma.friendship.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FriendshipCreateManyAndReturnArgs>(args?: SelectSubset<T, FriendshipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Friendship.
     * @param {FriendshipDeleteArgs} args - Arguments to delete one Friendship.
     * @example
     * // Delete one Friendship
     * const Friendship = await prisma.friendship.delete({
     *   where: {
     *     // ... filter to delete one Friendship
     *   }
     * })
     * 
     */
    delete<T extends FriendshipDeleteArgs>(args: SelectSubset<T, FriendshipDeleteArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Friendship.
     * @param {FriendshipUpdateArgs} args - Arguments to update one Friendship.
     * @example
     * // Update one Friendship
     * const friendship = await prisma.friendship.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FriendshipUpdateArgs>(args: SelectSubset<T, FriendshipUpdateArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Friendships.
     * @param {FriendshipDeleteManyArgs} args - Arguments to filter Friendships to delete.
     * @example
     * // Delete a few Friendships
     * const { count } = await prisma.friendship.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FriendshipDeleteManyArgs>(args?: SelectSubset<T, FriendshipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Friendships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Friendships
     * const friendship = await prisma.friendship.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FriendshipUpdateManyArgs>(args: SelectSubset<T, FriendshipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Friendships and returns the data updated in the database.
     * @param {FriendshipUpdateManyAndReturnArgs} args - Arguments to update many Friendships.
     * @example
     * // Update many Friendships
     * const friendship = await prisma.friendship.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Friendships and only return the `id`
     * const friendshipWithIdOnly = await prisma.friendship.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FriendshipUpdateManyAndReturnArgs>(args: SelectSubset<T, FriendshipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Friendship.
     * @param {FriendshipUpsertArgs} args - Arguments to update or create a Friendship.
     * @example
     * // Update or create a Friendship
     * const friendship = await prisma.friendship.upsert({
     *   create: {
     *     // ... data to create a Friendship
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Friendship we want to update
     *   }
     * })
     */
    upsert<T extends FriendshipUpsertArgs>(args: SelectSubset<T, FriendshipUpsertArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Friendships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipCountArgs} args - Arguments to filter Friendships to count.
     * @example
     * // Count the number of Friendships
     * const count = await prisma.friendship.count({
     *   where: {
     *     // ... the filter for the Friendships we want to count
     *   }
     * })
    **/
    count<T extends FriendshipCountArgs>(
      args?: Subset<T, FriendshipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FriendshipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Friendship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FriendshipAggregateArgs>(args: Subset<T, FriendshipAggregateArgs>): Prisma.PrismaPromise<GetFriendshipAggregateType<T>>

    /**
     * Group by Friendship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FriendshipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FriendshipGroupByArgs['orderBy'] }
        : { orderBy?: FriendshipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FriendshipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFriendshipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Friendship model
   */
  readonly fields: FriendshipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Friendship.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FriendshipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    initiator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    receiver<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    messages<T extends Friendship$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Friendship$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Friendship model
   */
  interface FriendshipFieldRefs {
    readonly id: FieldRef<"Friendship", 'String'>
    readonly initiatorId: FieldRef<"Friendship", 'String'>
    readonly receiverId: FieldRef<"Friendship", 'String'>
    readonly status: FieldRef<"Friendship", 'FriendshipStatus'>
    readonly createdAt: FieldRef<"Friendship", 'DateTime'>
    readonly updatedAt: FieldRef<"Friendship", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Friendship findUnique
   */
  export type FriendshipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship findUniqueOrThrow
   */
  export type FriendshipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship findFirst
   */
  export type FriendshipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Friendships.
     */
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship findFirstOrThrow
   */
  export type FriendshipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Friendships.
     */
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship findMany
   */
  export type FriendshipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendships to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship create
   */
  export type FriendshipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * The data needed to create a Friendship.
     */
    data: XOR<FriendshipCreateInput, FriendshipUncheckedCreateInput>
  }

  /**
   * Friendship createMany
   */
  export type FriendshipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Friendships.
     */
    data: FriendshipCreateManyInput | FriendshipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Friendship createManyAndReturn
   */
  export type FriendshipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * The data used to create many Friendships.
     */
    data: FriendshipCreateManyInput | FriendshipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Friendship update
   */
  export type FriendshipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * The data needed to update a Friendship.
     */
    data: XOR<FriendshipUpdateInput, FriendshipUncheckedUpdateInput>
    /**
     * Choose, which Friendship to update.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship updateMany
   */
  export type FriendshipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Friendships.
     */
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyInput>
    /**
     * Filter which Friendships to update
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to update.
     */
    limit?: number
  }

  /**
   * Friendship updateManyAndReturn
   */
  export type FriendshipUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * The data used to update Friendships.
     */
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyInput>
    /**
     * Filter which Friendships to update
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Friendship upsert
   */
  export type FriendshipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * The filter to search for the Friendship to update in case it exists.
     */
    where: FriendshipWhereUniqueInput
    /**
     * In case the Friendship found by the `where` argument doesn't exist, create a new Friendship with this data.
     */
    create: XOR<FriendshipCreateInput, FriendshipUncheckedCreateInput>
    /**
     * In case the Friendship was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FriendshipUpdateInput, FriendshipUncheckedUpdateInput>
  }

  /**
   * Friendship delete
   */
  export type FriendshipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter which Friendship to delete.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship deleteMany
   */
  export type FriendshipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Friendships to delete
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to delete.
     */
    limit?: number
  }

  /**
   * Friendship.messages
   */
  export type Friendship$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Friendship without action
   */
  export type FriendshipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
  }


  /**
   * Model Team
   */

  export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  export type TeamMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: $Enums.TeamType | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TeamMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: $Enums.TeamType | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TeamCountAggregateOutputType = {
    id: number
    name: number
    type: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TeamMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TeamMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TeamCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TeamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Team to aggregate.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Teams
    **/
    _count?: true | TeamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMaxAggregateInputType
  }

  export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
        [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeam[P]>
      : GetScalarType<T[P], AggregateTeam[P]>
  }




  export type TeamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamWhereInput
    orderBy?: TeamOrderByWithAggregationInput | TeamOrderByWithAggregationInput[]
    by: TeamScalarFieldEnum[] | TeamScalarFieldEnum
    having?: TeamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamCountAggregateInputType | true
    _min?: TeamMinAggregateInputType
    _max?: TeamMaxAggregateInputType
  }

  export type TeamGroupByOutputType = {
    id: string
    name: string
    type: $Enums.TeamType
    createdAt: Date
    updatedAt: Date
    _count: TeamCountAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamGroupByOutputType[P]>
            : GetScalarType<T[P], TeamGroupByOutputType[P]>
        }
      >
    >


  export type TeamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    members?: boolean | Team$membersArgs<ExtArgs>
    bannedUsers?: boolean | Team$bannedUsersArgs<ExtArgs>
    pendingRequests?: boolean | Team$pendingRequestsArgs<ExtArgs>
    projects?: boolean | Team$projectsArgs<ExtArgs>
    messages?: boolean | Team$messagesArgs<ExtArgs>
    notifications?: boolean | Team$notificationsArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["team"]>

  export type TeamSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["team"]>

  export type TeamSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TeamOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "type" | "createdAt" | "updatedAt", ExtArgs["result"]["team"]>
  export type TeamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | Team$membersArgs<ExtArgs>
    bannedUsers?: boolean | Team$bannedUsersArgs<ExtArgs>
    pendingRequests?: boolean | Team$pendingRequestsArgs<ExtArgs>
    projects?: boolean | Team$projectsArgs<ExtArgs>
    messages?: boolean | Team$messagesArgs<ExtArgs>
    notifications?: boolean | Team$notificationsArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TeamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TeamIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TeamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Team"
    objects: {
      members: Prisma.$TeamMemberPayload<ExtArgs>[]
      bannedUsers: Prisma.$TeamBanPayload<ExtArgs>[]
      pendingRequests: Prisma.$TeamRequestPayload<ExtArgs>[]
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: $Enums.TeamType
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["team"]>
    composites: {}
  }

  type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = $Result.GetResult<Prisma.$TeamPayload, S>

  type TeamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamCountAggregateInputType | true
    }

  export interface TeamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Team'], meta: { name: 'Team' } }
    /**
     * Find zero or one Team that matches the filter.
     * @param {TeamFindUniqueArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamFindUniqueArgs>(args: SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Team that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamFindUniqueOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamFindFirstArgs>(args?: SelectSubset<T, TeamFindFirstArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Teams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teams
     * const teams = await prisma.team.findMany()
     * 
     * // Get first 10 Teams
     * const teams = await prisma.team.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamWithIdOnly = await prisma.team.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamFindManyArgs>(args?: SelectSubset<T, TeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Team.
     * @param {TeamCreateArgs} args - Arguments to create a Team.
     * @example
     * // Create one Team
     * const Team = await prisma.team.create({
     *   data: {
     *     // ... data to create a Team
     *   }
     * })
     * 
     */
    create<T extends TeamCreateArgs>(args: SelectSubset<T, TeamCreateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Teams.
     * @param {TeamCreateManyArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamCreateManyArgs>(args?: SelectSubset<T, TeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Teams and returns the data saved in the database.
     * @param {TeamCreateManyAndReturnArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Team.
     * @param {TeamDeleteArgs} args - Arguments to delete one Team.
     * @example
     * // Delete one Team
     * const Team = await prisma.team.delete({
     *   where: {
     *     // ... filter to delete one Team
     *   }
     * })
     * 
     */
    delete<T extends TeamDeleteArgs>(args: SelectSubset<T, TeamDeleteArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Team.
     * @param {TeamUpdateArgs} args - Arguments to update one Team.
     * @example
     * // Update one Team
     * const team = await prisma.team.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamUpdateArgs>(args: SelectSubset<T, TeamUpdateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Teams.
     * @param {TeamDeleteManyArgs} args - Arguments to filter Teams to delete.
     * @example
     * // Delete a few Teams
     * const { count } = await prisma.team.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamDeleteManyArgs>(args?: SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamUpdateManyArgs>(args: SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams and returns the data updated in the database.
     * @param {TeamUpdateManyAndReturnArgs} args - Arguments to update many Teams.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Team.
     * @param {TeamUpsertArgs} args - Arguments to update or create a Team.
     * @example
     * // Update or create a Team
     * const team = await prisma.team.upsert({
     *   create: {
     *     // ... data to create a Team
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Team we want to update
     *   }
     * })
     */
    upsert<T extends TeamUpsertArgs>(args: SelectSubset<T, TeamUpsertArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamCountArgs} args - Arguments to filter Teams to count.
     * @example
     * // Count the number of Teams
     * const count = await prisma.team.count({
     *   where: {
     *     // ... the filter for the Teams we want to count
     *   }
     * })
    **/
    count<T extends TeamCountArgs>(
      args?: Subset<T, TeamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamAggregateArgs>(args: Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>

    /**
     * Group by Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamGroupByArgs['orderBy'] }
        : { orderBy?: TeamGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Team model
   */
  readonly fields: TeamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Team.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends Team$membersArgs<ExtArgs> = {}>(args?: Subset<T, Team$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bannedUsers<T extends Team$bannedUsersArgs<ExtArgs> = {}>(args?: Subset<T, Team$bannedUsersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamBanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pendingRequests<T extends Team$pendingRequestsArgs<ExtArgs> = {}>(args?: Subset<T, Team$pendingRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    projects<T extends Team$projectsArgs<ExtArgs> = {}>(args?: Subset<T, Team$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends Team$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Team$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends Team$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, Team$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Team model
   */
  interface TeamFieldRefs {
    readonly id: FieldRef<"Team", 'String'>
    readonly name: FieldRef<"Team", 'String'>
    readonly type: FieldRef<"Team", 'TeamType'>
    readonly createdAt: FieldRef<"Team", 'DateTime'>
    readonly updatedAt: FieldRef<"Team", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Team findUnique
   */
  export type TeamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findUniqueOrThrow
   */
  export type TeamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findFirst
   */
  export type TeamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findFirstOrThrow
   */
  export type TeamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findMany
   */
  export type TeamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Teams to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team create
   */
  export type TeamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to create a Team.
     */
    data: XOR<TeamCreateInput, TeamUncheckedCreateInput>
  }

  /**
   * Team createMany
   */
  export type TeamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team createManyAndReturn
   */
  export type TeamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team update
   */
  export type TeamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to update a Team.
     */
    data: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
    /**
     * Choose, which Team to update.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team updateMany
   */
  export type TeamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team updateManyAndReturn
   */
  export type TeamUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team upsert
   */
  export type TeamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The filter to search for the Team to update in case it exists.
     */
    where: TeamWhereUniqueInput
    /**
     * In case the Team found by the `where` argument doesn't exist, create a new Team with this data.
     */
    create: XOR<TeamCreateInput, TeamUncheckedCreateInput>
    /**
     * In case the Team was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
  }

  /**
   * Team delete
   */
  export type TeamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter which Team to delete.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team deleteMany
   */
  export type TeamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Teams to delete
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to delete.
     */
    limit?: number
  }

  /**
   * Team.members
   */
  export type Team$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    where?: TeamMemberWhereInput
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    cursor?: TeamMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * Team.bannedUsers
   */
  export type Team$bannedUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanInclude<ExtArgs> | null
    where?: TeamBanWhereInput
    orderBy?: TeamBanOrderByWithRelationInput | TeamBanOrderByWithRelationInput[]
    cursor?: TeamBanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamBanScalarFieldEnum | TeamBanScalarFieldEnum[]
  }

  /**
   * Team.pendingRequests
   */
  export type Team$pendingRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestInclude<ExtArgs> | null
    where?: TeamRequestWhereInput
    orderBy?: TeamRequestOrderByWithRelationInput | TeamRequestOrderByWithRelationInput[]
    cursor?: TeamRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamRequestScalarFieldEnum | TeamRequestScalarFieldEnum[]
  }

  /**
   * Team.projects
   */
  export type Team$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Team.messages
   */
  export type Team$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Team.notifications
   */
  export type Team$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Team without action
   */
  export type TeamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
  }


  /**
   * Model TeamMember
   */

  export type AggregateTeamMember = {
    _count: TeamMemberCountAggregateOutputType | null
    _min: TeamMemberMinAggregateOutputType | null
    _max: TeamMemberMaxAggregateOutputType | null
  }

  export type TeamMemberMinAggregateOutputType = {
    id: string | null
    teamId: string | null
    userId: string | null
    role: $Enums.TeamRole | null
    joinedAt: Date | null
  }

  export type TeamMemberMaxAggregateOutputType = {
    id: string | null
    teamId: string | null
    userId: string | null
    role: $Enums.TeamRole | null
    joinedAt: Date | null
  }

  export type TeamMemberCountAggregateOutputType = {
    id: number
    teamId: number
    userId: number
    role: number
    joinedAt: number
    _all: number
  }


  export type TeamMemberMinAggregateInputType = {
    id?: true
    teamId?: true
    userId?: true
    role?: true
    joinedAt?: true
  }

  export type TeamMemberMaxAggregateInputType = {
    id?: true
    teamId?: true
    userId?: true
    role?: true
    joinedAt?: true
  }

  export type TeamMemberCountAggregateInputType = {
    id?: true
    teamId?: true
    userId?: true
    role?: true
    joinedAt?: true
    _all?: true
  }

  export type TeamMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamMember to aggregate.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TeamMembers
    **/
    _count?: true | TeamMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMemberMaxAggregateInputType
  }

  export type GetTeamMemberAggregateType<T extends TeamMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateTeamMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeamMember[P]>
      : GetScalarType<T[P], AggregateTeamMember[P]>
  }




  export type TeamMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamMemberWhereInput
    orderBy?: TeamMemberOrderByWithAggregationInput | TeamMemberOrderByWithAggregationInput[]
    by: TeamMemberScalarFieldEnum[] | TeamMemberScalarFieldEnum
    having?: TeamMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamMemberCountAggregateInputType | true
    _min?: TeamMemberMinAggregateInputType
    _max?: TeamMemberMaxAggregateInputType
  }

  export type TeamMemberGroupByOutputType = {
    id: string
    teamId: string
    userId: string
    role: $Enums.TeamRole
    joinedAt: Date
    _count: TeamMemberCountAggregateOutputType | null
    _min: TeamMemberMinAggregateOutputType | null
    _max: TeamMemberMaxAggregateOutputType | null
  }

  type GetTeamMemberGroupByPayload<T extends TeamMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamMemberGroupByOutputType[P]>
            : GetScalarType<T[P], TeamMemberGroupByOutputType[P]>
        }
      >
    >


  export type TeamMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    teamId?: boolean
    userId?: boolean
    role?: boolean
    joinedAt?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamMember"]>

  export type TeamMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    teamId?: boolean
    userId?: boolean
    role?: boolean
    joinedAt?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamMember"]>

  export type TeamMemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    teamId?: boolean
    userId?: boolean
    role?: boolean
    joinedAt?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamMember"]>

  export type TeamMemberSelectScalar = {
    id?: boolean
    teamId?: boolean
    userId?: boolean
    role?: boolean
    joinedAt?: boolean
  }

  export type TeamMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "teamId" | "userId" | "role" | "joinedAt", ExtArgs["result"]["teamMember"]>
  export type TeamMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TeamMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TeamMemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TeamMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TeamMember"
    objects: {
      team: Prisma.$TeamPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      teamId: string
      userId: string
      role: $Enums.TeamRole
      joinedAt: Date
    }, ExtArgs["result"]["teamMember"]>
    composites: {}
  }

  type TeamMemberGetPayload<S extends boolean | null | undefined | TeamMemberDefaultArgs> = $Result.GetResult<Prisma.$TeamMemberPayload, S>

  type TeamMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamMemberCountAggregateInputType | true
    }

  export interface TeamMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TeamMember'], meta: { name: 'TeamMember' } }
    /**
     * Find zero or one TeamMember that matches the filter.
     * @param {TeamMemberFindUniqueArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamMemberFindUniqueArgs>(args: SelectSubset<T, TeamMemberFindUniqueArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TeamMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamMemberFindUniqueOrThrowArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TeamMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberFindFirstArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamMemberFindFirstArgs>(args?: SelectSubset<T, TeamMemberFindFirstArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TeamMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberFindFirstOrThrowArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TeamMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TeamMembers
     * const teamMembers = await prisma.teamMember.findMany()
     * 
     * // Get first 10 TeamMembers
     * const teamMembers = await prisma.teamMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamMemberWithIdOnly = await prisma.teamMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamMemberFindManyArgs>(args?: SelectSubset<T, TeamMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TeamMember.
     * @param {TeamMemberCreateArgs} args - Arguments to create a TeamMember.
     * @example
     * // Create one TeamMember
     * const TeamMember = await prisma.teamMember.create({
     *   data: {
     *     // ... data to create a TeamMember
     *   }
     * })
     * 
     */
    create<T extends TeamMemberCreateArgs>(args: SelectSubset<T, TeamMemberCreateArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TeamMembers.
     * @param {TeamMemberCreateManyArgs} args - Arguments to create many TeamMembers.
     * @example
     * // Create many TeamMembers
     * const teamMember = await prisma.teamMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamMemberCreateManyArgs>(args?: SelectSubset<T, TeamMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TeamMembers and returns the data saved in the database.
     * @param {TeamMemberCreateManyAndReturnArgs} args - Arguments to create many TeamMembers.
     * @example
     * // Create many TeamMembers
     * const teamMember = await prisma.teamMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TeamMembers and only return the `id`
     * const teamMemberWithIdOnly = await prisma.teamMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TeamMember.
     * @param {TeamMemberDeleteArgs} args - Arguments to delete one TeamMember.
     * @example
     * // Delete one TeamMember
     * const TeamMember = await prisma.teamMember.delete({
     *   where: {
     *     // ... filter to delete one TeamMember
     *   }
     * })
     * 
     */
    delete<T extends TeamMemberDeleteArgs>(args: SelectSubset<T, TeamMemberDeleteArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TeamMember.
     * @param {TeamMemberUpdateArgs} args - Arguments to update one TeamMember.
     * @example
     * // Update one TeamMember
     * const teamMember = await prisma.teamMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamMemberUpdateArgs>(args: SelectSubset<T, TeamMemberUpdateArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TeamMembers.
     * @param {TeamMemberDeleteManyArgs} args - Arguments to filter TeamMembers to delete.
     * @example
     * // Delete a few TeamMembers
     * const { count } = await prisma.teamMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamMemberDeleteManyArgs>(args?: SelectSubset<T, TeamMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TeamMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TeamMembers
     * const teamMember = await prisma.teamMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamMemberUpdateManyArgs>(args: SelectSubset<T, TeamMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TeamMembers and returns the data updated in the database.
     * @param {TeamMemberUpdateManyAndReturnArgs} args - Arguments to update many TeamMembers.
     * @example
     * // Update many TeamMembers
     * const teamMember = await prisma.teamMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TeamMembers and only return the `id`
     * const teamMemberWithIdOnly = await prisma.teamMember.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamMemberUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TeamMember.
     * @param {TeamMemberUpsertArgs} args - Arguments to update or create a TeamMember.
     * @example
     * // Update or create a TeamMember
     * const teamMember = await prisma.teamMember.upsert({
     *   create: {
     *     // ... data to create a TeamMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TeamMember we want to update
     *   }
     * })
     */
    upsert<T extends TeamMemberUpsertArgs>(args: SelectSubset<T, TeamMemberUpsertArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TeamMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberCountArgs} args - Arguments to filter TeamMembers to count.
     * @example
     * // Count the number of TeamMembers
     * const count = await prisma.teamMember.count({
     *   where: {
     *     // ... the filter for the TeamMembers we want to count
     *   }
     * })
    **/
    count<T extends TeamMemberCountArgs>(
      args?: Subset<T, TeamMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TeamMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamMemberAggregateArgs>(args: Subset<T, TeamMemberAggregateArgs>): Prisma.PrismaPromise<GetTeamMemberAggregateType<T>>

    /**
     * Group by TeamMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeamMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamMemberGroupByArgs['orderBy'] }
        : { orderBy?: TeamMemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeamMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TeamMember model
   */
  readonly fields: TeamMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TeamMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    team<T extends TeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeamDefaultArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TeamMember model
   */
  interface TeamMemberFieldRefs {
    readonly id: FieldRef<"TeamMember", 'String'>
    readonly teamId: FieldRef<"TeamMember", 'String'>
    readonly userId: FieldRef<"TeamMember", 'String'>
    readonly role: FieldRef<"TeamMember", 'TeamRole'>
    readonly joinedAt: FieldRef<"TeamMember", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TeamMember findUnique
   */
  export type TeamMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember findUniqueOrThrow
   */
  export type TeamMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember findFirst
   */
  export type TeamMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamMembers.
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamMembers.
     */
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * TeamMember findFirstOrThrow
   */
  export type TeamMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamMembers.
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamMembers.
     */
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * TeamMember findMany
   */
  export type TeamMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMembers to fetch.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TeamMembers.
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * TeamMember create
   */
  export type TeamMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a TeamMember.
     */
    data: XOR<TeamMemberCreateInput, TeamMemberUncheckedCreateInput>
  }

  /**
   * TeamMember createMany
   */
  export type TeamMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TeamMembers.
     */
    data: TeamMemberCreateManyInput | TeamMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TeamMember createManyAndReturn
   */
  export type TeamMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * The data used to create many TeamMembers.
     */
    data: TeamMemberCreateManyInput | TeamMemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TeamMember update
   */
  export type TeamMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a TeamMember.
     */
    data: XOR<TeamMemberUpdateInput, TeamMemberUncheckedUpdateInput>
    /**
     * Choose, which TeamMember to update.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember updateMany
   */
  export type TeamMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TeamMembers.
     */
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyInput>
    /**
     * Filter which TeamMembers to update
     */
    where?: TeamMemberWhereInput
    /**
     * Limit how many TeamMembers to update.
     */
    limit?: number
  }

  /**
   * TeamMember updateManyAndReturn
   */
  export type TeamMemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * The data used to update TeamMembers.
     */
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyInput>
    /**
     * Filter which TeamMembers to update
     */
    where?: TeamMemberWhereInput
    /**
     * Limit how many TeamMembers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TeamMember upsert
   */
  export type TeamMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the TeamMember to update in case it exists.
     */
    where: TeamMemberWhereUniqueInput
    /**
     * In case the TeamMember found by the `where` argument doesn't exist, create a new TeamMember with this data.
     */
    create: XOR<TeamMemberCreateInput, TeamMemberUncheckedCreateInput>
    /**
     * In case the TeamMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamMemberUpdateInput, TeamMemberUncheckedUpdateInput>
  }

  /**
   * TeamMember delete
   */
  export type TeamMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter which TeamMember to delete.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember deleteMany
   */
  export type TeamMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamMembers to delete
     */
    where?: TeamMemberWhereInput
    /**
     * Limit how many TeamMembers to delete.
     */
    limit?: number
  }

  /**
   * TeamMember without action
   */
  export type TeamMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
  }


  /**
   * Model TeamBan
   */

  export type AggregateTeamBan = {
    _count: TeamBanCountAggregateOutputType | null
    _min: TeamBanMinAggregateOutputType | null
    _max: TeamBanMaxAggregateOutputType | null
  }

  export type TeamBanMinAggregateOutputType = {
    id: string | null
    teamId: string | null
    userId: string | null
    bannedAt: Date | null
    reason: string | null
  }

  export type TeamBanMaxAggregateOutputType = {
    id: string | null
    teamId: string | null
    userId: string | null
    bannedAt: Date | null
    reason: string | null
  }

  export type TeamBanCountAggregateOutputType = {
    id: number
    teamId: number
    userId: number
    bannedAt: number
    reason: number
    _all: number
  }


  export type TeamBanMinAggregateInputType = {
    id?: true
    teamId?: true
    userId?: true
    bannedAt?: true
    reason?: true
  }

  export type TeamBanMaxAggregateInputType = {
    id?: true
    teamId?: true
    userId?: true
    bannedAt?: true
    reason?: true
  }

  export type TeamBanCountAggregateInputType = {
    id?: true
    teamId?: true
    userId?: true
    bannedAt?: true
    reason?: true
    _all?: true
  }

  export type TeamBanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamBan to aggregate.
     */
    where?: TeamBanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamBans to fetch.
     */
    orderBy?: TeamBanOrderByWithRelationInput | TeamBanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamBanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamBans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamBans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TeamBans
    **/
    _count?: true | TeamBanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamBanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamBanMaxAggregateInputType
  }

  export type GetTeamBanAggregateType<T extends TeamBanAggregateArgs> = {
        [P in keyof T & keyof AggregateTeamBan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeamBan[P]>
      : GetScalarType<T[P], AggregateTeamBan[P]>
  }




  export type TeamBanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamBanWhereInput
    orderBy?: TeamBanOrderByWithAggregationInput | TeamBanOrderByWithAggregationInput[]
    by: TeamBanScalarFieldEnum[] | TeamBanScalarFieldEnum
    having?: TeamBanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamBanCountAggregateInputType | true
    _min?: TeamBanMinAggregateInputType
    _max?: TeamBanMaxAggregateInputType
  }

  export type TeamBanGroupByOutputType = {
    id: string
    teamId: string
    userId: string
    bannedAt: Date
    reason: string | null
    _count: TeamBanCountAggregateOutputType | null
    _min: TeamBanMinAggregateOutputType | null
    _max: TeamBanMaxAggregateOutputType | null
  }

  type GetTeamBanGroupByPayload<T extends TeamBanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamBanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamBanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamBanGroupByOutputType[P]>
            : GetScalarType<T[P], TeamBanGroupByOutputType[P]>
        }
      >
    >


  export type TeamBanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    teamId?: boolean
    userId?: boolean
    bannedAt?: boolean
    reason?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamBan"]>

  export type TeamBanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    teamId?: boolean
    userId?: boolean
    bannedAt?: boolean
    reason?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamBan"]>

  export type TeamBanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    teamId?: boolean
    userId?: boolean
    bannedAt?: boolean
    reason?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamBan"]>

  export type TeamBanSelectScalar = {
    id?: boolean
    teamId?: boolean
    userId?: boolean
    bannedAt?: boolean
    reason?: boolean
  }

  export type TeamBanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "teamId" | "userId" | "bannedAt" | "reason", ExtArgs["result"]["teamBan"]>
  export type TeamBanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TeamBanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TeamBanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TeamBanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TeamBan"
    objects: {
      team: Prisma.$TeamPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      teamId: string
      userId: string
      bannedAt: Date
      reason: string | null
    }, ExtArgs["result"]["teamBan"]>
    composites: {}
  }

  type TeamBanGetPayload<S extends boolean | null | undefined | TeamBanDefaultArgs> = $Result.GetResult<Prisma.$TeamBanPayload, S>

  type TeamBanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamBanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamBanCountAggregateInputType | true
    }

  export interface TeamBanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TeamBan'], meta: { name: 'TeamBan' } }
    /**
     * Find zero or one TeamBan that matches the filter.
     * @param {TeamBanFindUniqueArgs} args - Arguments to find a TeamBan
     * @example
     * // Get one TeamBan
     * const teamBan = await prisma.teamBan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamBanFindUniqueArgs>(args: SelectSubset<T, TeamBanFindUniqueArgs<ExtArgs>>): Prisma__TeamBanClient<$Result.GetResult<Prisma.$TeamBanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TeamBan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamBanFindUniqueOrThrowArgs} args - Arguments to find a TeamBan
     * @example
     * // Get one TeamBan
     * const teamBan = await prisma.teamBan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamBanFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamBanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamBanClient<$Result.GetResult<Prisma.$TeamBanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TeamBan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamBanFindFirstArgs} args - Arguments to find a TeamBan
     * @example
     * // Get one TeamBan
     * const teamBan = await prisma.teamBan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamBanFindFirstArgs>(args?: SelectSubset<T, TeamBanFindFirstArgs<ExtArgs>>): Prisma__TeamBanClient<$Result.GetResult<Prisma.$TeamBanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TeamBan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamBanFindFirstOrThrowArgs} args - Arguments to find a TeamBan
     * @example
     * // Get one TeamBan
     * const teamBan = await prisma.teamBan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamBanFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamBanFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamBanClient<$Result.GetResult<Prisma.$TeamBanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TeamBans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamBanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TeamBans
     * const teamBans = await prisma.teamBan.findMany()
     * 
     * // Get first 10 TeamBans
     * const teamBans = await prisma.teamBan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamBanWithIdOnly = await prisma.teamBan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamBanFindManyArgs>(args?: SelectSubset<T, TeamBanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamBanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TeamBan.
     * @param {TeamBanCreateArgs} args - Arguments to create a TeamBan.
     * @example
     * // Create one TeamBan
     * const TeamBan = await prisma.teamBan.create({
     *   data: {
     *     // ... data to create a TeamBan
     *   }
     * })
     * 
     */
    create<T extends TeamBanCreateArgs>(args: SelectSubset<T, TeamBanCreateArgs<ExtArgs>>): Prisma__TeamBanClient<$Result.GetResult<Prisma.$TeamBanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TeamBans.
     * @param {TeamBanCreateManyArgs} args - Arguments to create many TeamBans.
     * @example
     * // Create many TeamBans
     * const teamBan = await prisma.teamBan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamBanCreateManyArgs>(args?: SelectSubset<T, TeamBanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TeamBans and returns the data saved in the database.
     * @param {TeamBanCreateManyAndReturnArgs} args - Arguments to create many TeamBans.
     * @example
     * // Create many TeamBans
     * const teamBan = await prisma.teamBan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TeamBans and only return the `id`
     * const teamBanWithIdOnly = await prisma.teamBan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamBanCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamBanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamBanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TeamBan.
     * @param {TeamBanDeleteArgs} args - Arguments to delete one TeamBan.
     * @example
     * // Delete one TeamBan
     * const TeamBan = await prisma.teamBan.delete({
     *   where: {
     *     // ... filter to delete one TeamBan
     *   }
     * })
     * 
     */
    delete<T extends TeamBanDeleteArgs>(args: SelectSubset<T, TeamBanDeleteArgs<ExtArgs>>): Prisma__TeamBanClient<$Result.GetResult<Prisma.$TeamBanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TeamBan.
     * @param {TeamBanUpdateArgs} args - Arguments to update one TeamBan.
     * @example
     * // Update one TeamBan
     * const teamBan = await prisma.teamBan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamBanUpdateArgs>(args: SelectSubset<T, TeamBanUpdateArgs<ExtArgs>>): Prisma__TeamBanClient<$Result.GetResult<Prisma.$TeamBanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TeamBans.
     * @param {TeamBanDeleteManyArgs} args - Arguments to filter TeamBans to delete.
     * @example
     * // Delete a few TeamBans
     * const { count } = await prisma.teamBan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamBanDeleteManyArgs>(args?: SelectSubset<T, TeamBanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TeamBans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamBanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TeamBans
     * const teamBan = await prisma.teamBan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamBanUpdateManyArgs>(args: SelectSubset<T, TeamBanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TeamBans and returns the data updated in the database.
     * @param {TeamBanUpdateManyAndReturnArgs} args - Arguments to update many TeamBans.
     * @example
     * // Update many TeamBans
     * const teamBan = await prisma.teamBan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TeamBans and only return the `id`
     * const teamBanWithIdOnly = await prisma.teamBan.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamBanUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamBanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamBanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TeamBan.
     * @param {TeamBanUpsertArgs} args - Arguments to update or create a TeamBan.
     * @example
     * // Update or create a TeamBan
     * const teamBan = await prisma.teamBan.upsert({
     *   create: {
     *     // ... data to create a TeamBan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TeamBan we want to update
     *   }
     * })
     */
    upsert<T extends TeamBanUpsertArgs>(args: SelectSubset<T, TeamBanUpsertArgs<ExtArgs>>): Prisma__TeamBanClient<$Result.GetResult<Prisma.$TeamBanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TeamBans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamBanCountArgs} args - Arguments to filter TeamBans to count.
     * @example
     * // Count the number of TeamBans
     * const count = await prisma.teamBan.count({
     *   where: {
     *     // ... the filter for the TeamBans we want to count
     *   }
     * })
    **/
    count<T extends TeamBanCountArgs>(
      args?: Subset<T, TeamBanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamBanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TeamBan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamBanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamBanAggregateArgs>(args: Subset<T, TeamBanAggregateArgs>): Prisma.PrismaPromise<GetTeamBanAggregateType<T>>

    /**
     * Group by TeamBan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamBanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeamBanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamBanGroupByArgs['orderBy'] }
        : { orderBy?: TeamBanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeamBanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamBanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TeamBan model
   */
  readonly fields: TeamBanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TeamBan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamBanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    team<T extends TeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeamDefaultArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TeamBan model
   */
  interface TeamBanFieldRefs {
    readonly id: FieldRef<"TeamBan", 'String'>
    readonly teamId: FieldRef<"TeamBan", 'String'>
    readonly userId: FieldRef<"TeamBan", 'String'>
    readonly bannedAt: FieldRef<"TeamBan", 'DateTime'>
    readonly reason: FieldRef<"TeamBan", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TeamBan findUnique
   */
  export type TeamBanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanInclude<ExtArgs> | null
    /**
     * Filter, which TeamBan to fetch.
     */
    where: TeamBanWhereUniqueInput
  }

  /**
   * TeamBan findUniqueOrThrow
   */
  export type TeamBanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanInclude<ExtArgs> | null
    /**
     * Filter, which TeamBan to fetch.
     */
    where: TeamBanWhereUniqueInput
  }

  /**
   * TeamBan findFirst
   */
  export type TeamBanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanInclude<ExtArgs> | null
    /**
     * Filter, which TeamBan to fetch.
     */
    where?: TeamBanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamBans to fetch.
     */
    orderBy?: TeamBanOrderByWithRelationInput | TeamBanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamBans.
     */
    cursor?: TeamBanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamBans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamBans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamBans.
     */
    distinct?: TeamBanScalarFieldEnum | TeamBanScalarFieldEnum[]
  }

  /**
   * TeamBan findFirstOrThrow
   */
  export type TeamBanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanInclude<ExtArgs> | null
    /**
     * Filter, which TeamBan to fetch.
     */
    where?: TeamBanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamBans to fetch.
     */
    orderBy?: TeamBanOrderByWithRelationInput | TeamBanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamBans.
     */
    cursor?: TeamBanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamBans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamBans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamBans.
     */
    distinct?: TeamBanScalarFieldEnum | TeamBanScalarFieldEnum[]
  }

  /**
   * TeamBan findMany
   */
  export type TeamBanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanInclude<ExtArgs> | null
    /**
     * Filter, which TeamBans to fetch.
     */
    where?: TeamBanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamBans to fetch.
     */
    orderBy?: TeamBanOrderByWithRelationInput | TeamBanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TeamBans.
     */
    cursor?: TeamBanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamBans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamBans.
     */
    skip?: number
    distinct?: TeamBanScalarFieldEnum | TeamBanScalarFieldEnum[]
  }

  /**
   * TeamBan create
   */
  export type TeamBanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanInclude<ExtArgs> | null
    /**
     * The data needed to create a TeamBan.
     */
    data: XOR<TeamBanCreateInput, TeamBanUncheckedCreateInput>
  }

  /**
   * TeamBan createMany
   */
  export type TeamBanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TeamBans.
     */
    data: TeamBanCreateManyInput | TeamBanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TeamBan createManyAndReturn
   */
  export type TeamBanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * The data used to create many TeamBans.
     */
    data: TeamBanCreateManyInput | TeamBanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TeamBan update
   */
  export type TeamBanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanInclude<ExtArgs> | null
    /**
     * The data needed to update a TeamBan.
     */
    data: XOR<TeamBanUpdateInput, TeamBanUncheckedUpdateInput>
    /**
     * Choose, which TeamBan to update.
     */
    where: TeamBanWhereUniqueInput
  }

  /**
   * TeamBan updateMany
   */
  export type TeamBanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TeamBans.
     */
    data: XOR<TeamBanUpdateManyMutationInput, TeamBanUncheckedUpdateManyInput>
    /**
     * Filter which TeamBans to update
     */
    where?: TeamBanWhereInput
    /**
     * Limit how many TeamBans to update.
     */
    limit?: number
  }

  /**
   * TeamBan updateManyAndReturn
   */
  export type TeamBanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * The data used to update TeamBans.
     */
    data: XOR<TeamBanUpdateManyMutationInput, TeamBanUncheckedUpdateManyInput>
    /**
     * Filter which TeamBans to update
     */
    where?: TeamBanWhereInput
    /**
     * Limit how many TeamBans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TeamBan upsert
   */
  export type TeamBanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanInclude<ExtArgs> | null
    /**
     * The filter to search for the TeamBan to update in case it exists.
     */
    where: TeamBanWhereUniqueInput
    /**
     * In case the TeamBan found by the `where` argument doesn't exist, create a new TeamBan with this data.
     */
    create: XOR<TeamBanCreateInput, TeamBanUncheckedCreateInput>
    /**
     * In case the TeamBan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamBanUpdateInput, TeamBanUncheckedUpdateInput>
  }

  /**
   * TeamBan delete
   */
  export type TeamBanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanInclude<ExtArgs> | null
    /**
     * Filter which TeamBan to delete.
     */
    where: TeamBanWhereUniqueInput
  }

  /**
   * TeamBan deleteMany
   */
  export type TeamBanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamBans to delete
     */
    where?: TeamBanWhereInput
    /**
     * Limit how many TeamBans to delete.
     */
    limit?: number
  }

  /**
   * TeamBan without action
   */
  export type TeamBanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamBan
     */
    select?: TeamBanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamBan
     */
    omit?: TeamBanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamBanInclude<ExtArgs> | null
  }


  /**
   * Model TeamRequest
   */

  export type AggregateTeamRequest = {
    _count: TeamRequestCountAggregateOutputType | null
    _min: TeamRequestMinAggregateOutputType | null
    _max: TeamRequestMaxAggregateOutputType | null
  }

  export type TeamRequestMinAggregateOutputType = {
    id: string | null
    teamId: string | null
    userId: string | null
    requestedAt: Date | null
    status: $Enums.RequestStatus | null
  }

  export type TeamRequestMaxAggregateOutputType = {
    id: string | null
    teamId: string | null
    userId: string | null
    requestedAt: Date | null
    status: $Enums.RequestStatus | null
  }

  export type TeamRequestCountAggregateOutputType = {
    id: number
    teamId: number
    userId: number
    requestedAt: number
    status: number
    _all: number
  }


  export type TeamRequestMinAggregateInputType = {
    id?: true
    teamId?: true
    userId?: true
    requestedAt?: true
    status?: true
  }

  export type TeamRequestMaxAggregateInputType = {
    id?: true
    teamId?: true
    userId?: true
    requestedAt?: true
    status?: true
  }

  export type TeamRequestCountAggregateInputType = {
    id?: true
    teamId?: true
    userId?: true
    requestedAt?: true
    status?: true
    _all?: true
  }

  export type TeamRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamRequest to aggregate.
     */
    where?: TeamRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamRequests to fetch.
     */
    orderBy?: TeamRequestOrderByWithRelationInput | TeamRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TeamRequests
    **/
    _count?: true | TeamRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamRequestMaxAggregateInputType
  }

  export type GetTeamRequestAggregateType<T extends TeamRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateTeamRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeamRequest[P]>
      : GetScalarType<T[P], AggregateTeamRequest[P]>
  }




  export type TeamRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamRequestWhereInput
    orderBy?: TeamRequestOrderByWithAggregationInput | TeamRequestOrderByWithAggregationInput[]
    by: TeamRequestScalarFieldEnum[] | TeamRequestScalarFieldEnum
    having?: TeamRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamRequestCountAggregateInputType | true
    _min?: TeamRequestMinAggregateInputType
    _max?: TeamRequestMaxAggregateInputType
  }

  export type TeamRequestGroupByOutputType = {
    id: string
    teamId: string
    userId: string
    requestedAt: Date
    status: $Enums.RequestStatus
    _count: TeamRequestCountAggregateOutputType | null
    _min: TeamRequestMinAggregateOutputType | null
    _max: TeamRequestMaxAggregateOutputType | null
  }

  type GetTeamRequestGroupByPayload<T extends TeamRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamRequestGroupByOutputType[P]>
            : GetScalarType<T[P], TeamRequestGroupByOutputType[P]>
        }
      >
    >


  export type TeamRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    teamId?: boolean
    userId?: boolean
    requestedAt?: boolean
    status?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamRequest"]>

  export type TeamRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    teamId?: boolean
    userId?: boolean
    requestedAt?: boolean
    status?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamRequest"]>

  export type TeamRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    teamId?: boolean
    userId?: boolean
    requestedAt?: boolean
    status?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamRequest"]>

  export type TeamRequestSelectScalar = {
    id?: boolean
    teamId?: boolean
    userId?: boolean
    requestedAt?: boolean
    status?: boolean
  }

  export type TeamRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "teamId" | "userId" | "requestedAt" | "status", ExtArgs["result"]["teamRequest"]>
  export type TeamRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TeamRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TeamRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TeamRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TeamRequest"
    objects: {
      team: Prisma.$TeamPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      teamId: string
      userId: string
      requestedAt: Date
      status: $Enums.RequestStatus
    }, ExtArgs["result"]["teamRequest"]>
    composites: {}
  }

  type TeamRequestGetPayload<S extends boolean | null | undefined | TeamRequestDefaultArgs> = $Result.GetResult<Prisma.$TeamRequestPayload, S>

  type TeamRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamRequestCountAggregateInputType | true
    }

  export interface TeamRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TeamRequest'], meta: { name: 'TeamRequest' } }
    /**
     * Find zero or one TeamRequest that matches the filter.
     * @param {TeamRequestFindUniqueArgs} args - Arguments to find a TeamRequest
     * @example
     * // Get one TeamRequest
     * const teamRequest = await prisma.teamRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamRequestFindUniqueArgs>(args: SelectSubset<T, TeamRequestFindUniqueArgs<ExtArgs>>): Prisma__TeamRequestClient<$Result.GetResult<Prisma.$TeamRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TeamRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamRequestFindUniqueOrThrowArgs} args - Arguments to find a TeamRequest
     * @example
     * // Get one TeamRequest
     * const teamRequest = await prisma.teamRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamRequestClient<$Result.GetResult<Prisma.$TeamRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TeamRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamRequestFindFirstArgs} args - Arguments to find a TeamRequest
     * @example
     * // Get one TeamRequest
     * const teamRequest = await prisma.teamRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamRequestFindFirstArgs>(args?: SelectSubset<T, TeamRequestFindFirstArgs<ExtArgs>>): Prisma__TeamRequestClient<$Result.GetResult<Prisma.$TeamRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TeamRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamRequestFindFirstOrThrowArgs} args - Arguments to find a TeamRequest
     * @example
     * // Get one TeamRequest
     * const teamRequest = await prisma.teamRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamRequestClient<$Result.GetResult<Prisma.$TeamRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TeamRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TeamRequests
     * const teamRequests = await prisma.teamRequest.findMany()
     * 
     * // Get first 10 TeamRequests
     * const teamRequests = await prisma.teamRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamRequestWithIdOnly = await prisma.teamRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamRequestFindManyArgs>(args?: SelectSubset<T, TeamRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TeamRequest.
     * @param {TeamRequestCreateArgs} args - Arguments to create a TeamRequest.
     * @example
     * // Create one TeamRequest
     * const TeamRequest = await prisma.teamRequest.create({
     *   data: {
     *     // ... data to create a TeamRequest
     *   }
     * })
     * 
     */
    create<T extends TeamRequestCreateArgs>(args: SelectSubset<T, TeamRequestCreateArgs<ExtArgs>>): Prisma__TeamRequestClient<$Result.GetResult<Prisma.$TeamRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TeamRequests.
     * @param {TeamRequestCreateManyArgs} args - Arguments to create many TeamRequests.
     * @example
     * // Create many TeamRequests
     * const teamRequest = await prisma.teamRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamRequestCreateManyArgs>(args?: SelectSubset<T, TeamRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TeamRequests and returns the data saved in the database.
     * @param {TeamRequestCreateManyAndReturnArgs} args - Arguments to create many TeamRequests.
     * @example
     * // Create many TeamRequests
     * const teamRequest = await prisma.teamRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TeamRequests and only return the `id`
     * const teamRequestWithIdOnly = await prisma.teamRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TeamRequest.
     * @param {TeamRequestDeleteArgs} args - Arguments to delete one TeamRequest.
     * @example
     * // Delete one TeamRequest
     * const TeamRequest = await prisma.teamRequest.delete({
     *   where: {
     *     // ... filter to delete one TeamRequest
     *   }
     * })
     * 
     */
    delete<T extends TeamRequestDeleteArgs>(args: SelectSubset<T, TeamRequestDeleteArgs<ExtArgs>>): Prisma__TeamRequestClient<$Result.GetResult<Prisma.$TeamRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TeamRequest.
     * @param {TeamRequestUpdateArgs} args - Arguments to update one TeamRequest.
     * @example
     * // Update one TeamRequest
     * const teamRequest = await prisma.teamRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamRequestUpdateArgs>(args: SelectSubset<T, TeamRequestUpdateArgs<ExtArgs>>): Prisma__TeamRequestClient<$Result.GetResult<Prisma.$TeamRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TeamRequests.
     * @param {TeamRequestDeleteManyArgs} args - Arguments to filter TeamRequests to delete.
     * @example
     * // Delete a few TeamRequests
     * const { count } = await prisma.teamRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamRequestDeleteManyArgs>(args?: SelectSubset<T, TeamRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TeamRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TeamRequests
     * const teamRequest = await prisma.teamRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamRequestUpdateManyArgs>(args: SelectSubset<T, TeamRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TeamRequests and returns the data updated in the database.
     * @param {TeamRequestUpdateManyAndReturnArgs} args - Arguments to update many TeamRequests.
     * @example
     * // Update many TeamRequests
     * const teamRequest = await prisma.teamRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TeamRequests and only return the `id`
     * const teamRequestWithIdOnly = await prisma.teamRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TeamRequest.
     * @param {TeamRequestUpsertArgs} args - Arguments to update or create a TeamRequest.
     * @example
     * // Update or create a TeamRequest
     * const teamRequest = await prisma.teamRequest.upsert({
     *   create: {
     *     // ... data to create a TeamRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TeamRequest we want to update
     *   }
     * })
     */
    upsert<T extends TeamRequestUpsertArgs>(args: SelectSubset<T, TeamRequestUpsertArgs<ExtArgs>>): Prisma__TeamRequestClient<$Result.GetResult<Prisma.$TeamRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TeamRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamRequestCountArgs} args - Arguments to filter TeamRequests to count.
     * @example
     * // Count the number of TeamRequests
     * const count = await prisma.teamRequest.count({
     *   where: {
     *     // ... the filter for the TeamRequests we want to count
     *   }
     * })
    **/
    count<T extends TeamRequestCountArgs>(
      args?: Subset<T, TeamRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TeamRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamRequestAggregateArgs>(args: Subset<T, TeamRequestAggregateArgs>): Prisma.PrismaPromise<GetTeamRequestAggregateType<T>>

    /**
     * Group by TeamRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeamRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamRequestGroupByArgs['orderBy'] }
        : { orderBy?: TeamRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeamRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TeamRequest model
   */
  readonly fields: TeamRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TeamRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    team<T extends TeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeamDefaultArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TeamRequest model
   */
  interface TeamRequestFieldRefs {
    readonly id: FieldRef<"TeamRequest", 'String'>
    readonly teamId: FieldRef<"TeamRequest", 'String'>
    readonly userId: FieldRef<"TeamRequest", 'String'>
    readonly requestedAt: FieldRef<"TeamRequest", 'DateTime'>
    readonly status: FieldRef<"TeamRequest", 'RequestStatus'>
  }
    

  // Custom InputTypes
  /**
   * TeamRequest findUnique
   */
  export type TeamRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestInclude<ExtArgs> | null
    /**
     * Filter, which TeamRequest to fetch.
     */
    where: TeamRequestWhereUniqueInput
  }

  /**
   * TeamRequest findUniqueOrThrow
   */
  export type TeamRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestInclude<ExtArgs> | null
    /**
     * Filter, which TeamRequest to fetch.
     */
    where: TeamRequestWhereUniqueInput
  }

  /**
   * TeamRequest findFirst
   */
  export type TeamRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestInclude<ExtArgs> | null
    /**
     * Filter, which TeamRequest to fetch.
     */
    where?: TeamRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamRequests to fetch.
     */
    orderBy?: TeamRequestOrderByWithRelationInput | TeamRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamRequests.
     */
    cursor?: TeamRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamRequests.
     */
    distinct?: TeamRequestScalarFieldEnum | TeamRequestScalarFieldEnum[]
  }

  /**
   * TeamRequest findFirstOrThrow
   */
  export type TeamRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestInclude<ExtArgs> | null
    /**
     * Filter, which TeamRequest to fetch.
     */
    where?: TeamRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamRequests to fetch.
     */
    orderBy?: TeamRequestOrderByWithRelationInput | TeamRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamRequests.
     */
    cursor?: TeamRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamRequests.
     */
    distinct?: TeamRequestScalarFieldEnum | TeamRequestScalarFieldEnum[]
  }

  /**
   * TeamRequest findMany
   */
  export type TeamRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestInclude<ExtArgs> | null
    /**
     * Filter, which TeamRequests to fetch.
     */
    where?: TeamRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamRequests to fetch.
     */
    orderBy?: TeamRequestOrderByWithRelationInput | TeamRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TeamRequests.
     */
    cursor?: TeamRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamRequests.
     */
    skip?: number
    distinct?: TeamRequestScalarFieldEnum | TeamRequestScalarFieldEnum[]
  }

  /**
   * TeamRequest create
   */
  export type TeamRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a TeamRequest.
     */
    data: XOR<TeamRequestCreateInput, TeamRequestUncheckedCreateInput>
  }

  /**
   * TeamRequest createMany
   */
  export type TeamRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TeamRequests.
     */
    data: TeamRequestCreateManyInput | TeamRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TeamRequest createManyAndReturn
   */
  export type TeamRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * The data used to create many TeamRequests.
     */
    data: TeamRequestCreateManyInput | TeamRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TeamRequest update
   */
  export type TeamRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a TeamRequest.
     */
    data: XOR<TeamRequestUpdateInput, TeamRequestUncheckedUpdateInput>
    /**
     * Choose, which TeamRequest to update.
     */
    where: TeamRequestWhereUniqueInput
  }

  /**
   * TeamRequest updateMany
   */
  export type TeamRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TeamRequests.
     */
    data: XOR<TeamRequestUpdateManyMutationInput, TeamRequestUncheckedUpdateManyInput>
    /**
     * Filter which TeamRequests to update
     */
    where?: TeamRequestWhereInput
    /**
     * Limit how many TeamRequests to update.
     */
    limit?: number
  }

  /**
   * TeamRequest updateManyAndReturn
   */
  export type TeamRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * The data used to update TeamRequests.
     */
    data: XOR<TeamRequestUpdateManyMutationInput, TeamRequestUncheckedUpdateManyInput>
    /**
     * Filter which TeamRequests to update
     */
    where?: TeamRequestWhereInput
    /**
     * Limit how many TeamRequests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TeamRequest upsert
   */
  export type TeamRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the TeamRequest to update in case it exists.
     */
    where: TeamRequestWhereUniqueInput
    /**
     * In case the TeamRequest found by the `where` argument doesn't exist, create a new TeamRequest with this data.
     */
    create: XOR<TeamRequestCreateInput, TeamRequestUncheckedCreateInput>
    /**
     * In case the TeamRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamRequestUpdateInput, TeamRequestUncheckedUpdateInput>
  }

  /**
   * TeamRequest delete
   */
  export type TeamRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestInclude<ExtArgs> | null
    /**
     * Filter which TeamRequest to delete.
     */
    where: TeamRequestWhereUniqueInput
  }

  /**
   * TeamRequest deleteMany
   */
  export type TeamRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamRequests to delete
     */
    where?: TeamRequestWhereInput
    /**
     * Limit how many TeamRequests to delete.
     */
    limit?: number
  }

  /**
   * TeamRequest without action
   */
  export type TeamRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamRequest
     */
    select?: TeamRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamRequest
     */
    omit?: TeamRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamRequestInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    packages: string | null
    type: $Enums.ProjectType | null
    isGitImport: boolean | null
    gitKey: string | null
    gitRepo: string | null
    updatedAt: Date | null
    ownerId: string | null
    teamId: string | null
    generatedById: string | null
    archeivedBy: string | null
    createdAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    packages: string | null
    type: $Enums.ProjectType | null
    isGitImport: boolean | null
    gitKey: string | null
    gitRepo: string | null
    updatedAt: Date | null
    ownerId: string | null
    teamId: string | null
    generatedById: string | null
    archeivedBy: string | null
    createdAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    name: number
    description: number
    packages: number
    type: number
    isGitImport: number
    gitKey: number
    gitRepo: number
    updatedAt: number
    ownerId: number
    teamId: number
    generatedById: number
    archeivedBy: number
    createdAt: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    packages?: true
    type?: true
    isGitImport?: true
    gitKey?: true
    gitRepo?: true
    updatedAt?: true
    ownerId?: true
    teamId?: true
    generatedById?: true
    archeivedBy?: true
    createdAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    packages?: true
    type?: true
    isGitImport?: true
    gitKey?: true
    gitRepo?: true
    updatedAt?: true
    ownerId?: true
    teamId?: true
    generatedById?: true
    archeivedBy?: true
    createdAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    packages?: true
    type?: true
    isGitImport?: true
    gitKey?: true
    gitRepo?: true
    updatedAt?: true
    ownerId?: true
    teamId?: true
    generatedById?: true
    archeivedBy?: true
    createdAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    name: string
    description: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport: boolean
    gitKey: string | null
    gitRepo: string | null
    updatedAt: Date
    ownerId: string
    teamId: string | null
    generatedById: string | null
    archeivedBy: string | null
    createdAt: Date
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    packages?: boolean
    type?: boolean
    isGitImport?: boolean
    gitKey?: boolean
    gitRepo?: boolean
    updatedAt?: boolean
    ownerId?: boolean
    teamId?: boolean
    generatedById?: boolean
    archeivedBy?: boolean
    createdAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    team?: boolean | Project$teamArgs<ExtArgs>
    starredBy?: boolean | Project$starredByArgs<ExtArgs>
    archiveprojectBy?: boolean | Project$archiveprojectByArgs<ExtArgs>
    genratedProjectsby?: boolean | Project$genratedProjectsbyArgs<ExtArgs>
    files?: boolean | Project$filesArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    packages?: boolean
    type?: boolean
    isGitImport?: boolean
    gitKey?: boolean
    gitRepo?: boolean
    updatedAt?: boolean
    ownerId?: boolean
    teamId?: boolean
    generatedById?: boolean
    archeivedBy?: boolean
    createdAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    team?: boolean | Project$teamArgs<ExtArgs>
    archiveprojectBy?: boolean | Project$archiveprojectByArgs<ExtArgs>
    genratedProjectsby?: boolean | Project$genratedProjectsbyArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    packages?: boolean
    type?: boolean
    isGitImport?: boolean
    gitKey?: boolean
    gitRepo?: boolean
    updatedAt?: boolean
    ownerId?: boolean
    teamId?: boolean
    generatedById?: boolean
    archeivedBy?: boolean
    createdAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    team?: boolean | Project$teamArgs<ExtArgs>
    archiveprojectBy?: boolean | Project$archiveprojectByArgs<ExtArgs>
    genratedProjectsby?: boolean | Project$genratedProjectsbyArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    packages?: boolean
    type?: boolean
    isGitImport?: boolean
    gitKey?: boolean
    gitRepo?: boolean
    updatedAt?: boolean
    ownerId?: boolean
    teamId?: boolean
    generatedById?: boolean
    archeivedBy?: boolean
    createdAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "packages" | "type" | "isGitImport" | "gitKey" | "gitRepo" | "updatedAt" | "ownerId" | "teamId" | "generatedById" | "archeivedBy" | "createdAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    team?: boolean | Project$teamArgs<ExtArgs>
    starredBy?: boolean | Project$starredByArgs<ExtArgs>
    archiveprojectBy?: boolean | Project$archiveprojectByArgs<ExtArgs>
    genratedProjectsby?: boolean | Project$genratedProjectsbyArgs<ExtArgs>
    files?: boolean | Project$filesArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    team?: boolean | Project$teamArgs<ExtArgs>
    archiveprojectBy?: boolean | Project$archiveprojectByArgs<ExtArgs>
    genratedProjectsby?: boolean | Project$genratedProjectsbyArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    team?: boolean | Project$teamArgs<ExtArgs>
    archiveprojectBy?: boolean | Project$archiveprojectByArgs<ExtArgs>
    genratedProjectsby?: boolean | Project$genratedProjectsbyArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      team: Prisma.$TeamPayload<ExtArgs> | null
      starredBy: Prisma.$UserPayload<ExtArgs>[]
      archiveprojectBy: Prisma.$UserPayload<ExtArgs> | null
      genratedProjectsby: Prisma.$UserPayload<ExtArgs> | null
      files: Prisma.$FileItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      packages: string
      type: $Enums.ProjectType
      isGitImport: boolean
      gitKey: string | null
      gitRepo: string | null
      updatedAt: Date
      ownerId: string
      teamId: string | null
      generatedById: string | null
      archeivedBy: string | null
      createdAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    team<T extends Project$teamArgs<ExtArgs> = {}>(args?: Subset<T, Project$teamArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    starredBy<T extends Project$starredByArgs<ExtArgs> = {}>(args?: Subset<T, Project$starredByArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    archiveprojectBy<T extends Project$archiveprojectByArgs<ExtArgs> = {}>(args?: Subset<T, Project$archiveprojectByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    genratedProjectsby<T extends Project$genratedProjectsbyArgs<ExtArgs> = {}>(args?: Subset<T, Project$genratedProjectsbyArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    files<T extends Project$filesArgs<ExtArgs> = {}>(args?: Subset<T, Project$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly description: FieldRef<"Project", 'String'>
    readonly packages: FieldRef<"Project", 'String'>
    readonly type: FieldRef<"Project", 'ProjectType'>
    readonly isGitImport: FieldRef<"Project", 'Boolean'>
    readonly gitKey: FieldRef<"Project", 'String'>
    readonly gitRepo: FieldRef<"Project", 'String'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
    readonly ownerId: FieldRef<"Project", 'String'>
    readonly teamId: FieldRef<"Project", 'String'>
    readonly generatedById: FieldRef<"Project", 'String'>
    readonly archeivedBy: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.team
   */
  export type Project$teamArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    where?: TeamWhereInput
  }

  /**
   * Project.starredBy
   */
  export type Project$starredByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Project.archiveprojectBy
   */
  export type Project$archiveprojectByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Project.genratedProjectsby
   */
  export type Project$genratedProjectsbyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Project.files
   */
  export type Project$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemInclude<ExtArgs> | null
    where?: FileItemWhereInput
    orderBy?: FileItemOrderByWithRelationInput | FileItemOrderByWithRelationInput[]
    cursor?: FileItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileItemScalarFieldEnum | FileItemScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model FileItem
   */

  export type AggregateFileItem = {
    _count: FileItemCountAggregateOutputType | null
    _min: FileItemMinAggregateOutputType | null
    _max: FileItemMaxAggregateOutputType | null
  }

  export type FileItemMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    content: string | null
    projectId: string | null
    parentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FileItemMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    content: string | null
    projectId: string | null
    parentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FileItemCountAggregateOutputType = {
    id: number
    name: number
    type: number
    content: number
    projectId: number
    parentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FileItemMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    content?: true
    projectId?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FileItemMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    content?: true
    projectId?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FileItemCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    content?: true
    projectId?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FileItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileItem to aggregate.
     */
    where?: FileItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileItems to fetch.
     */
    orderBy?: FileItemOrderByWithRelationInput | FileItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FileItems
    **/
    _count?: true | FileItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileItemMaxAggregateInputType
  }

  export type GetFileItemAggregateType<T extends FileItemAggregateArgs> = {
        [P in keyof T & keyof AggregateFileItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFileItem[P]>
      : GetScalarType<T[P], AggregateFileItem[P]>
  }




  export type FileItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileItemWhereInput
    orderBy?: FileItemOrderByWithAggregationInput | FileItemOrderByWithAggregationInput[]
    by: FileItemScalarFieldEnum[] | FileItemScalarFieldEnum
    having?: FileItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileItemCountAggregateInputType | true
    _min?: FileItemMinAggregateInputType
    _max?: FileItemMaxAggregateInputType
  }

  export type FileItemGroupByOutputType = {
    id: string
    name: string
    type: string
    content: string
    projectId: string
    parentId: string | null
    createdAt: Date
    updatedAt: Date
    _count: FileItemCountAggregateOutputType | null
    _min: FileItemMinAggregateOutputType | null
    _max: FileItemMaxAggregateOutputType | null
  }

  type GetFileItemGroupByPayload<T extends FileItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileItemGroupByOutputType[P]>
            : GetScalarType<T[P], FileItemGroupByOutputType[P]>
        }
      >
    >


  export type FileItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    content?: boolean
    projectId?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    parent?: boolean | FileItem$parentArgs<ExtArgs>
    children?: boolean | FileItem$childrenArgs<ExtArgs>
    _count?: boolean | FileItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileItem"]>

  export type FileItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    content?: boolean
    projectId?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    parent?: boolean | FileItem$parentArgs<ExtArgs>
  }, ExtArgs["result"]["fileItem"]>

  export type FileItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    content?: boolean
    projectId?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    parent?: boolean | FileItem$parentArgs<ExtArgs>
  }, ExtArgs["result"]["fileItem"]>

  export type FileItemSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    content?: boolean
    projectId?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FileItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "type" | "content" | "projectId" | "parentId" | "createdAt" | "updatedAt", ExtArgs["result"]["fileItem"]>
  export type FileItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    parent?: boolean | FileItem$parentArgs<ExtArgs>
    children?: boolean | FileItem$childrenArgs<ExtArgs>
    _count?: boolean | FileItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FileItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    parent?: boolean | FileItem$parentArgs<ExtArgs>
  }
  export type FileItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    parent?: boolean | FileItem$parentArgs<ExtArgs>
  }

  export type $FileItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FileItem"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      parent: Prisma.$FileItemPayload<ExtArgs> | null
      children: Prisma.$FileItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: string
      content: string
      projectId: string
      parentId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["fileItem"]>
    composites: {}
  }

  type FileItemGetPayload<S extends boolean | null | undefined | FileItemDefaultArgs> = $Result.GetResult<Prisma.$FileItemPayload, S>

  type FileItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FileItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FileItemCountAggregateInputType | true
    }

  export interface FileItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FileItem'], meta: { name: 'FileItem' } }
    /**
     * Find zero or one FileItem that matches the filter.
     * @param {FileItemFindUniqueArgs} args - Arguments to find a FileItem
     * @example
     * // Get one FileItem
     * const fileItem = await prisma.fileItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileItemFindUniqueArgs>(args: SelectSubset<T, FileItemFindUniqueArgs<ExtArgs>>): Prisma__FileItemClient<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FileItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FileItemFindUniqueOrThrowArgs} args - Arguments to find a FileItem
     * @example
     * // Get one FileItem
     * const fileItem = await prisma.fileItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileItemFindUniqueOrThrowArgs>(args: SelectSubset<T, FileItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileItemClient<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FileItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileItemFindFirstArgs} args - Arguments to find a FileItem
     * @example
     * // Get one FileItem
     * const fileItem = await prisma.fileItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileItemFindFirstArgs>(args?: SelectSubset<T, FileItemFindFirstArgs<ExtArgs>>): Prisma__FileItemClient<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FileItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileItemFindFirstOrThrowArgs} args - Arguments to find a FileItem
     * @example
     * // Get one FileItem
     * const fileItem = await prisma.fileItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileItemFindFirstOrThrowArgs>(args?: SelectSubset<T, FileItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileItemClient<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FileItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FileItems
     * const fileItems = await prisma.fileItem.findMany()
     * 
     * // Get first 10 FileItems
     * const fileItems = await prisma.fileItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileItemWithIdOnly = await prisma.fileItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileItemFindManyArgs>(args?: SelectSubset<T, FileItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FileItem.
     * @param {FileItemCreateArgs} args - Arguments to create a FileItem.
     * @example
     * // Create one FileItem
     * const FileItem = await prisma.fileItem.create({
     *   data: {
     *     // ... data to create a FileItem
     *   }
     * })
     * 
     */
    create<T extends FileItemCreateArgs>(args: SelectSubset<T, FileItemCreateArgs<ExtArgs>>): Prisma__FileItemClient<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FileItems.
     * @param {FileItemCreateManyArgs} args - Arguments to create many FileItems.
     * @example
     * // Create many FileItems
     * const fileItem = await prisma.fileItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileItemCreateManyArgs>(args?: SelectSubset<T, FileItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FileItems and returns the data saved in the database.
     * @param {FileItemCreateManyAndReturnArgs} args - Arguments to create many FileItems.
     * @example
     * // Create many FileItems
     * const fileItem = await prisma.fileItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FileItems and only return the `id`
     * const fileItemWithIdOnly = await prisma.fileItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileItemCreateManyAndReturnArgs>(args?: SelectSubset<T, FileItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FileItem.
     * @param {FileItemDeleteArgs} args - Arguments to delete one FileItem.
     * @example
     * // Delete one FileItem
     * const FileItem = await prisma.fileItem.delete({
     *   where: {
     *     // ... filter to delete one FileItem
     *   }
     * })
     * 
     */
    delete<T extends FileItemDeleteArgs>(args: SelectSubset<T, FileItemDeleteArgs<ExtArgs>>): Prisma__FileItemClient<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FileItem.
     * @param {FileItemUpdateArgs} args - Arguments to update one FileItem.
     * @example
     * // Update one FileItem
     * const fileItem = await prisma.fileItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileItemUpdateArgs>(args: SelectSubset<T, FileItemUpdateArgs<ExtArgs>>): Prisma__FileItemClient<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FileItems.
     * @param {FileItemDeleteManyArgs} args - Arguments to filter FileItems to delete.
     * @example
     * // Delete a few FileItems
     * const { count } = await prisma.fileItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileItemDeleteManyArgs>(args?: SelectSubset<T, FileItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FileItems
     * const fileItem = await prisma.fileItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileItemUpdateManyArgs>(args: SelectSubset<T, FileItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileItems and returns the data updated in the database.
     * @param {FileItemUpdateManyAndReturnArgs} args - Arguments to update many FileItems.
     * @example
     * // Update many FileItems
     * const fileItem = await prisma.fileItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FileItems and only return the `id`
     * const fileItemWithIdOnly = await prisma.fileItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FileItemUpdateManyAndReturnArgs>(args: SelectSubset<T, FileItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FileItem.
     * @param {FileItemUpsertArgs} args - Arguments to update or create a FileItem.
     * @example
     * // Update or create a FileItem
     * const fileItem = await prisma.fileItem.upsert({
     *   create: {
     *     // ... data to create a FileItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FileItem we want to update
     *   }
     * })
     */
    upsert<T extends FileItemUpsertArgs>(args: SelectSubset<T, FileItemUpsertArgs<ExtArgs>>): Prisma__FileItemClient<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FileItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileItemCountArgs} args - Arguments to filter FileItems to count.
     * @example
     * // Count the number of FileItems
     * const count = await prisma.fileItem.count({
     *   where: {
     *     // ... the filter for the FileItems we want to count
     *   }
     * })
    **/
    count<T extends FileItemCountArgs>(
      args?: Subset<T, FileItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FileItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileItemAggregateArgs>(args: Subset<T, FileItemAggregateArgs>): Prisma.PrismaPromise<GetFileItemAggregateType<T>>

    /**
     * Group by FileItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileItemGroupByArgs['orderBy'] }
        : { orderBy?: FileItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FileItem model
   */
  readonly fields: FileItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FileItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    parent<T extends FileItem$parentArgs<ExtArgs> = {}>(args?: Subset<T, FileItem$parentArgs<ExtArgs>>): Prisma__FileItemClient<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    children<T extends FileItem$childrenArgs<ExtArgs> = {}>(args?: Subset<T, FileItem$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FileItem model
   */
  interface FileItemFieldRefs {
    readonly id: FieldRef<"FileItem", 'String'>
    readonly name: FieldRef<"FileItem", 'String'>
    readonly type: FieldRef<"FileItem", 'String'>
    readonly content: FieldRef<"FileItem", 'String'>
    readonly projectId: FieldRef<"FileItem", 'String'>
    readonly parentId: FieldRef<"FileItem", 'String'>
    readonly createdAt: FieldRef<"FileItem", 'DateTime'>
    readonly updatedAt: FieldRef<"FileItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FileItem findUnique
   */
  export type FileItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemInclude<ExtArgs> | null
    /**
     * Filter, which FileItem to fetch.
     */
    where: FileItemWhereUniqueInput
  }

  /**
   * FileItem findUniqueOrThrow
   */
  export type FileItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemInclude<ExtArgs> | null
    /**
     * Filter, which FileItem to fetch.
     */
    where: FileItemWhereUniqueInput
  }

  /**
   * FileItem findFirst
   */
  export type FileItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemInclude<ExtArgs> | null
    /**
     * Filter, which FileItem to fetch.
     */
    where?: FileItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileItems to fetch.
     */
    orderBy?: FileItemOrderByWithRelationInput | FileItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileItems.
     */
    cursor?: FileItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileItems.
     */
    distinct?: FileItemScalarFieldEnum | FileItemScalarFieldEnum[]
  }

  /**
   * FileItem findFirstOrThrow
   */
  export type FileItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemInclude<ExtArgs> | null
    /**
     * Filter, which FileItem to fetch.
     */
    where?: FileItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileItems to fetch.
     */
    orderBy?: FileItemOrderByWithRelationInput | FileItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileItems.
     */
    cursor?: FileItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileItems.
     */
    distinct?: FileItemScalarFieldEnum | FileItemScalarFieldEnum[]
  }

  /**
   * FileItem findMany
   */
  export type FileItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemInclude<ExtArgs> | null
    /**
     * Filter, which FileItems to fetch.
     */
    where?: FileItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileItems to fetch.
     */
    orderBy?: FileItemOrderByWithRelationInput | FileItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FileItems.
     */
    cursor?: FileItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileItems.
     */
    skip?: number
    distinct?: FileItemScalarFieldEnum | FileItemScalarFieldEnum[]
  }

  /**
   * FileItem create
   */
  export type FileItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemInclude<ExtArgs> | null
    /**
     * The data needed to create a FileItem.
     */
    data: XOR<FileItemCreateInput, FileItemUncheckedCreateInput>
  }

  /**
   * FileItem createMany
   */
  export type FileItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FileItems.
     */
    data: FileItemCreateManyInput | FileItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FileItem createManyAndReturn
   */
  export type FileItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * The data used to create many FileItems.
     */
    data: FileItemCreateManyInput | FileItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FileItem update
   */
  export type FileItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemInclude<ExtArgs> | null
    /**
     * The data needed to update a FileItem.
     */
    data: XOR<FileItemUpdateInput, FileItemUncheckedUpdateInput>
    /**
     * Choose, which FileItem to update.
     */
    where: FileItemWhereUniqueInput
  }

  /**
   * FileItem updateMany
   */
  export type FileItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FileItems.
     */
    data: XOR<FileItemUpdateManyMutationInput, FileItemUncheckedUpdateManyInput>
    /**
     * Filter which FileItems to update
     */
    where?: FileItemWhereInput
    /**
     * Limit how many FileItems to update.
     */
    limit?: number
  }

  /**
   * FileItem updateManyAndReturn
   */
  export type FileItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * The data used to update FileItems.
     */
    data: XOR<FileItemUpdateManyMutationInput, FileItemUncheckedUpdateManyInput>
    /**
     * Filter which FileItems to update
     */
    where?: FileItemWhereInput
    /**
     * Limit how many FileItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FileItem upsert
   */
  export type FileItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemInclude<ExtArgs> | null
    /**
     * The filter to search for the FileItem to update in case it exists.
     */
    where: FileItemWhereUniqueInput
    /**
     * In case the FileItem found by the `where` argument doesn't exist, create a new FileItem with this data.
     */
    create: XOR<FileItemCreateInput, FileItemUncheckedCreateInput>
    /**
     * In case the FileItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileItemUpdateInput, FileItemUncheckedUpdateInput>
  }

  /**
   * FileItem delete
   */
  export type FileItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemInclude<ExtArgs> | null
    /**
     * Filter which FileItem to delete.
     */
    where: FileItemWhereUniqueInput
  }

  /**
   * FileItem deleteMany
   */
  export type FileItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileItems to delete
     */
    where?: FileItemWhereInput
    /**
     * Limit how many FileItems to delete.
     */
    limit?: number
  }

  /**
   * FileItem.parent
   */
  export type FileItem$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemInclude<ExtArgs> | null
    where?: FileItemWhereInput
  }

  /**
   * FileItem.children
   */
  export type FileItem$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemInclude<ExtArgs> | null
    where?: FileItemWhereInput
    orderBy?: FileItemOrderByWithRelationInput | FileItemOrderByWithRelationInput[]
    cursor?: FileItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileItemScalarFieldEnum | FileItemScalarFieldEnum[]
  }

  /**
   * FileItem without action
   */
  export type FileItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileItem
     */
    select?: FileItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileItem
     */
    omit?: FileItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileItemInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    content: string | null
    senderId: string | null
    dmChatRoomId: string | null
    teamId: string | null
    isRead: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    content: string | null
    senderId: string | null
    dmChatRoomId: string | null
    teamId: string | null
    isRead: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    content: number
    senderId: number
    dmChatRoomId: number
    teamId: number
    isRead: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    content?: true
    senderId?: true
    dmChatRoomId?: true
    teamId?: true
    isRead?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    content?: true
    senderId?: true
    dmChatRoomId?: true
    teamId?: true
    isRead?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    content?: true
    senderId?: true
    dmChatRoomId?: true
    teamId?: true
    isRead?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    content: string
    senderId: string
    dmChatRoomId: string | null
    teamId: string | null
    isRead: boolean
    createdAt: Date
    updatedAt: Date
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    senderId?: boolean
    dmChatRoomId?: boolean
    teamId?: boolean
    isRead?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    dmChatRoom?: boolean | Message$dmChatRoomArgs<ExtArgs>
    team?: boolean | Message$teamArgs<ExtArgs>
    notifications?: boolean | Message$notificationsArgs<ExtArgs>
    isDeletedBy?: boolean | Message$isDeletedByArgs<ExtArgs>
    _count?: boolean | MessageCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    senderId?: boolean
    dmChatRoomId?: boolean
    teamId?: boolean
    isRead?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    dmChatRoom?: boolean | Message$dmChatRoomArgs<ExtArgs>
    team?: boolean | Message$teamArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    senderId?: boolean
    dmChatRoomId?: boolean
    teamId?: boolean
    isRead?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    dmChatRoom?: boolean | Message$dmChatRoomArgs<ExtArgs>
    team?: boolean | Message$teamArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    content?: boolean
    senderId?: boolean
    dmChatRoomId?: boolean
    teamId?: boolean
    isRead?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "senderId" | "dmChatRoomId" | "teamId" | "isRead" | "createdAt" | "updatedAt", ExtArgs["result"]["message"]>
  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    dmChatRoom?: boolean | Message$dmChatRoomArgs<ExtArgs>
    team?: boolean | Message$teamArgs<ExtArgs>
    notifications?: boolean | Message$notificationsArgs<ExtArgs>
    isDeletedBy?: boolean | Message$isDeletedByArgs<ExtArgs>
    _count?: boolean | MessageCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    dmChatRoom?: boolean | Message$dmChatRoomArgs<ExtArgs>
    team?: boolean | Message$teamArgs<ExtArgs>
  }
  export type MessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    dmChatRoom?: boolean | Message$dmChatRoomArgs<ExtArgs>
    team?: boolean | Message$teamArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      sender: Prisma.$UserPayload<ExtArgs>
      dmChatRoom: Prisma.$FriendshipPayload<ExtArgs> | null
      team: Prisma.$TeamPayload<ExtArgs> | null
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
      isDeletedBy: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      senderId: string
      dmChatRoomId: string | null
      teamId: string | null
      isRead: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sender<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    dmChatRoom<T extends Message$dmChatRoomArgs<ExtArgs> = {}>(args?: Subset<T, Message$dmChatRoomArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    team<T extends Message$teamArgs<ExtArgs> = {}>(args?: Subset<T, Message$teamArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    notifications<T extends Message$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, Message$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    isDeletedBy<T extends Message$isDeletedByArgs<ExtArgs> = {}>(args?: Subset<T, Message$isDeletedByArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly content: FieldRef<"Message", 'String'>
    readonly senderId: FieldRef<"Message", 'String'>
    readonly dmChatRoomId: FieldRef<"Message", 'String'>
    readonly teamId: FieldRef<"Message", 'String'>
    readonly isRead: FieldRef<"Message", 'Boolean'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
    readonly updatedAt: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message.dmChatRoom
   */
  export type Message$dmChatRoomArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    where?: FriendshipWhereInput
  }

  /**
   * Message.team
   */
  export type Message$teamArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    where?: TeamWhereInput
  }

  /**
   * Message.notifications
   */
  export type Message$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Message.isDeletedBy
   */
  export type Message$isDeletedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    senderId: string | null
    receiverId: string | null
    type: $Enums.NotificationType | null
    content: string | null
    messageId: string | null
    teamId: string | null
    isRead: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    senderId: string | null
    receiverId: string | null
    type: $Enums.NotificationType | null
    content: string | null
    messageId: string | null
    teamId: string | null
    isRead: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    senderId: number
    receiverId: number
    type: number
    content: number
    messageId: number
    teamId: number
    isRead: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    type?: true
    content?: true
    messageId?: true
    teamId?: true
    isRead?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    type?: true
    content?: true
    messageId?: true
    teamId?: true
    isRead?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    type?: true
    content?: true
    messageId?: true
    teamId?: true
    isRead?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    senderId: string
    receiverId: string
    type: $Enums.NotificationType
    content: string | null
    messageId: string | null
    teamId: string | null
    isRead: boolean
    createdAt: Date
    updatedAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    type?: boolean
    content?: boolean
    messageId?: boolean
    teamId?: boolean
    isRead?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    message?: boolean | Notification$messageArgs<ExtArgs>
    team?: boolean | Notification$teamArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    type?: boolean
    content?: boolean
    messageId?: boolean
    teamId?: boolean
    isRead?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    message?: boolean | Notification$messageArgs<ExtArgs>
    team?: boolean | Notification$teamArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    type?: boolean
    content?: boolean
    messageId?: boolean
    teamId?: boolean
    isRead?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    message?: boolean | Notification$messageArgs<ExtArgs>
    team?: boolean | Notification$teamArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    type?: boolean
    content?: boolean
    messageId?: boolean
    teamId?: boolean
    isRead?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "senderId" | "receiverId" | "type" | "content" | "messageId" | "teamId" | "isRead" | "createdAt" | "updatedAt", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    message?: boolean | Notification$messageArgs<ExtArgs>
    team?: boolean | Notification$teamArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    message?: boolean | Notification$messageArgs<ExtArgs>
    team?: boolean | Notification$teamArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    message?: boolean | Notification$messageArgs<ExtArgs>
    team?: boolean | Notification$teamArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      sender: Prisma.$UserPayload<ExtArgs>
      receiver: Prisma.$UserPayload<ExtArgs>
      message: Prisma.$MessagePayload<ExtArgs> | null
      team: Prisma.$TeamPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      senderId: string
      receiverId: string
      type: $Enums.NotificationType
      content: string | null
      messageId: string | null
      teamId: string | null
      isRead: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sender<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    receiver<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    message<T extends Notification$messageArgs<ExtArgs> = {}>(args?: Subset<T, Notification$messageArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    team<T extends Notification$teamArgs<ExtArgs> = {}>(args?: Subset<T, Notification$teamArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly senderId: FieldRef<"Notification", 'String'>
    readonly receiverId: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'NotificationType'>
    readonly content: FieldRef<"Notification", 'String'>
    readonly messageId: FieldRef<"Notification", 'String'>
    readonly teamId: FieldRef<"Notification", 'String'>
    readonly isRead: FieldRef<"Notification", 'Boolean'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
    readonly updatedAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification.message
   */
  export type Notification$messageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
  }

  /**
   * Notification.team
   */
  export type Notification$teamArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    where?: TeamWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    fullName: 'fullName',
    email: 'email',
    username: 'username',
    password: 'password',
    createdAt: 'createdAt',
    avatar: 'avatar',
    githubUrl: 'githubUrl',
    bio: 'bio'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const FriendshipScalarFieldEnum: {
    id: 'id',
    initiatorId: 'initiatorId',
    receiverId: 'receiverId',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FriendshipScalarFieldEnum = (typeof FriendshipScalarFieldEnum)[keyof typeof FriendshipScalarFieldEnum]


  export const TeamScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum]


  export const TeamMemberScalarFieldEnum: {
    id: 'id',
    teamId: 'teamId',
    userId: 'userId',
    role: 'role',
    joinedAt: 'joinedAt'
  };

  export type TeamMemberScalarFieldEnum = (typeof TeamMemberScalarFieldEnum)[keyof typeof TeamMemberScalarFieldEnum]


  export const TeamBanScalarFieldEnum: {
    id: 'id',
    teamId: 'teamId',
    userId: 'userId',
    bannedAt: 'bannedAt',
    reason: 'reason'
  };

  export type TeamBanScalarFieldEnum = (typeof TeamBanScalarFieldEnum)[keyof typeof TeamBanScalarFieldEnum]


  export const TeamRequestScalarFieldEnum: {
    id: 'id',
    teamId: 'teamId',
    userId: 'userId',
    requestedAt: 'requestedAt',
    status: 'status'
  };

  export type TeamRequestScalarFieldEnum = (typeof TeamRequestScalarFieldEnum)[keyof typeof TeamRequestScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    packages: 'packages',
    type: 'type',
    isGitImport: 'isGitImport',
    gitKey: 'gitKey',
    gitRepo: 'gitRepo',
    updatedAt: 'updatedAt',
    ownerId: 'ownerId',
    teamId: 'teamId',
    generatedById: 'generatedById',
    archeivedBy: 'archeivedBy',
    createdAt: 'createdAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const FileItemScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    content: 'content',
    projectId: 'projectId',
    parentId: 'parentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FileItemScalarFieldEnum = (typeof FileItemScalarFieldEnum)[keyof typeof FileItemScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    content: 'content',
    senderId: 'senderId',
    dmChatRoomId: 'dmChatRoomId',
    teamId: 'teamId',
    isRead: 'isRead',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    senderId: 'senderId',
    receiverId: 'receiverId',
    type: 'type',
    content: 'content',
    messageId: 'messageId',
    teamId: 'teamId',
    isRead: 'isRead',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'FriendshipStatus'
   */
  export type EnumFriendshipStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FriendshipStatus'>
    


  /**
   * Reference to a field of type 'FriendshipStatus[]'
   */
  export type ListEnumFriendshipStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FriendshipStatus[]'>
    


  /**
   * Reference to a field of type 'TeamType'
   */
  export type EnumTeamTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TeamType'>
    


  /**
   * Reference to a field of type 'TeamType[]'
   */
  export type ListEnumTeamTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TeamType[]'>
    


  /**
   * Reference to a field of type 'TeamRole'
   */
  export type EnumTeamRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TeamRole'>
    


  /**
   * Reference to a field of type 'TeamRole[]'
   */
  export type ListEnumTeamRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TeamRole[]'>
    


  /**
   * Reference to a field of type 'RequestStatus'
   */
  export type EnumRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestStatus'>
    


  /**
   * Reference to a field of type 'RequestStatus[]'
   */
  export type ListEnumRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestStatus[]'>
    


  /**
   * Reference to a field of type 'ProjectType'
   */
  export type EnumProjectTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectType'>
    


  /**
   * Reference to a field of type 'ProjectType[]'
   */
  export type ListEnumProjectTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectType[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'NotificationType'
   */
  export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType'>
    


  /**
   * Reference to a field of type 'NotificationType[]'
   */
  export type ListEnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    avatar?: StringNullableFilter<"User"> | string | null
    githubUrl?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    archieveProjects?: ProjectListRelationFilter
    appsGenerated?: ProjectListRelationFilter
    starredProjects?: ProjectListRelationFilter
    projects?: ProjectListRelationFilter
    teams?: TeamMemberListRelationFilter
    teamJoinRequests?: TeamRequestListRelationFilter
    teamBans?: TeamBanListRelationFilter
    sentMessages?: MessageListRelationFilter
    sentNotifications?: NotificationListRelationFilter
    receivedNotifications?: NotificationListRelationFilter
    deletedMessages?: MessageListRelationFilter
    friendshipsInitiated?: FriendshipListRelationFilter
    friendshipsReceived?: FriendshipListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    avatar?: SortOrderInput | SortOrder
    githubUrl?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    archieveProjects?: ProjectOrderByRelationAggregateInput
    appsGenerated?: ProjectOrderByRelationAggregateInput
    starredProjects?: ProjectOrderByRelationAggregateInput
    projects?: ProjectOrderByRelationAggregateInput
    teams?: TeamMemberOrderByRelationAggregateInput
    teamJoinRequests?: TeamRequestOrderByRelationAggregateInput
    teamBans?: TeamBanOrderByRelationAggregateInput
    sentMessages?: MessageOrderByRelationAggregateInput
    sentNotifications?: NotificationOrderByRelationAggregateInput
    receivedNotifications?: NotificationOrderByRelationAggregateInput
    deletedMessages?: MessageOrderByRelationAggregateInput
    friendshipsInitiated?: FriendshipOrderByRelationAggregateInput
    friendshipsReceived?: FriendshipOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    fullName?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    avatar?: StringNullableFilter<"User"> | string | null
    githubUrl?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    archieveProjects?: ProjectListRelationFilter
    appsGenerated?: ProjectListRelationFilter
    starredProjects?: ProjectListRelationFilter
    projects?: ProjectListRelationFilter
    teams?: TeamMemberListRelationFilter
    teamJoinRequests?: TeamRequestListRelationFilter
    teamBans?: TeamBanListRelationFilter
    sentMessages?: MessageListRelationFilter
    sentNotifications?: NotificationListRelationFilter
    receivedNotifications?: NotificationListRelationFilter
    deletedMessages?: MessageListRelationFilter
    friendshipsInitiated?: FriendshipListRelationFilter
    friendshipsReceived?: FriendshipListRelationFilter
  }, "id" | "email" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    avatar?: SortOrderInput | SortOrder
    githubUrl?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    fullName?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    githubUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    bio?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type FriendshipWhereInput = {
    AND?: FriendshipWhereInput | FriendshipWhereInput[]
    OR?: FriendshipWhereInput[]
    NOT?: FriendshipWhereInput | FriendshipWhereInput[]
    id?: StringFilter<"Friendship"> | string
    initiatorId?: StringFilter<"Friendship"> | string
    receiverId?: StringFilter<"Friendship"> | string
    status?: EnumFriendshipStatusFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeFilter<"Friendship"> | Date | string
    initiator?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
    messages?: MessageListRelationFilter
  }

  export type FriendshipOrderByWithRelationInput = {
    id?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    initiator?: UserOrderByWithRelationInput
    receiver?: UserOrderByWithRelationInput
    messages?: MessageOrderByRelationAggregateInput
  }

  export type FriendshipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    initiatorId_receiverId?: FriendshipInitiatorIdReceiverIdCompoundUniqueInput
    AND?: FriendshipWhereInput | FriendshipWhereInput[]
    OR?: FriendshipWhereInput[]
    NOT?: FriendshipWhereInput | FriendshipWhereInput[]
    initiatorId?: StringFilter<"Friendship"> | string
    receiverId?: StringFilter<"Friendship"> | string
    status?: EnumFriendshipStatusFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeFilter<"Friendship"> | Date | string
    initiator?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
    messages?: MessageListRelationFilter
  }, "id" | "initiatorId_receiverId">

  export type FriendshipOrderByWithAggregationInput = {
    id?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FriendshipCountOrderByAggregateInput
    _max?: FriendshipMaxOrderByAggregateInput
    _min?: FriendshipMinOrderByAggregateInput
  }

  export type FriendshipScalarWhereWithAggregatesInput = {
    AND?: FriendshipScalarWhereWithAggregatesInput | FriendshipScalarWhereWithAggregatesInput[]
    OR?: FriendshipScalarWhereWithAggregatesInput[]
    NOT?: FriendshipScalarWhereWithAggregatesInput | FriendshipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Friendship"> | string
    initiatorId?: StringWithAggregatesFilter<"Friendship"> | string
    receiverId?: StringWithAggregatesFilter<"Friendship"> | string
    status?: EnumFriendshipStatusWithAggregatesFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeWithAggregatesFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Friendship"> | Date | string
  }

  export type TeamWhereInput = {
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    id?: StringFilter<"Team"> | string
    name?: StringFilter<"Team"> | string
    type?: EnumTeamTypeFilter<"Team"> | $Enums.TeamType
    createdAt?: DateTimeFilter<"Team"> | Date | string
    updatedAt?: DateTimeFilter<"Team"> | Date | string
    members?: TeamMemberListRelationFilter
    bannedUsers?: TeamBanListRelationFilter
    pendingRequests?: TeamRequestListRelationFilter
    projects?: ProjectListRelationFilter
    messages?: MessageListRelationFilter
    notifications?: NotificationListRelationFilter
  }

  export type TeamOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    members?: TeamMemberOrderByRelationAggregateInput
    bannedUsers?: TeamBanOrderByRelationAggregateInput
    pendingRequests?: TeamRequestOrderByRelationAggregateInput
    projects?: ProjectOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    name?: StringFilter<"Team"> | string
    type?: EnumTeamTypeFilter<"Team"> | $Enums.TeamType
    createdAt?: DateTimeFilter<"Team"> | Date | string
    updatedAt?: DateTimeFilter<"Team"> | Date | string
    members?: TeamMemberListRelationFilter
    bannedUsers?: TeamBanListRelationFilter
    pendingRequests?: TeamRequestListRelationFilter
    projects?: ProjectListRelationFilter
    messages?: MessageListRelationFilter
    notifications?: NotificationListRelationFilter
  }, "id">

  export type TeamOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TeamCountOrderByAggregateInput
    _max?: TeamMaxOrderByAggregateInput
    _min?: TeamMinOrderByAggregateInput
  }

  export type TeamScalarWhereWithAggregatesInput = {
    AND?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    OR?: TeamScalarWhereWithAggregatesInput[]
    NOT?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Team"> | string
    name?: StringWithAggregatesFilter<"Team"> | string
    type?: EnumTeamTypeWithAggregatesFilter<"Team"> | $Enums.TeamType
    createdAt?: DateTimeWithAggregatesFilter<"Team"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Team"> | Date | string
  }

  export type TeamMemberWhereInput = {
    AND?: TeamMemberWhereInput | TeamMemberWhereInput[]
    OR?: TeamMemberWhereInput[]
    NOT?: TeamMemberWhereInput | TeamMemberWhereInput[]
    id?: StringFilter<"TeamMember"> | string
    teamId?: StringFilter<"TeamMember"> | string
    userId?: StringFilter<"TeamMember"> | string
    role?: EnumTeamRoleFilter<"TeamMember"> | $Enums.TeamRole
    joinedAt?: DateTimeFilter<"TeamMember"> | Date | string
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TeamMemberOrderByWithRelationInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    team?: TeamOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type TeamMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    teamId_userId?: TeamMemberTeamIdUserIdCompoundUniqueInput
    AND?: TeamMemberWhereInput | TeamMemberWhereInput[]
    OR?: TeamMemberWhereInput[]
    NOT?: TeamMemberWhereInput | TeamMemberWhereInput[]
    teamId?: StringFilter<"TeamMember"> | string
    userId?: StringFilter<"TeamMember"> | string
    role?: EnumTeamRoleFilter<"TeamMember"> | $Enums.TeamRole
    joinedAt?: DateTimeFilter<"TeamMember"> | Date | string
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "teamId_userId">

  export type TeamMemberOrderByWithAggregationInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    _count?: TeamMemberCountOrderByAggregateInput
    _max?: TeamMemberMaxOrderByAggregateInput
    _min?: TeamMemberMinOrderByAggregateInput
  }

  export type TeamMemberScalarWhereWithAggregatesInput = {
    AND?: TeamMemberScalarWhereWithAggregatesInput | TeamMemberScalarWhereWithAggregatesInput[]
    OR?: TeamMemberScalarWhereWithAggregatesInput[]
    NOT?: TeamMemberScalarWhereWithAggregatesInput | TeamMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TeamMember"> | string
    teamId?: StringWithAggregatesFilter<"TeamMember"> | string
    userId?: StringWithAggregatesFilter<"TeamMember"> | string
    role?: EnumTeamRoleWithAggregatesFilter<"TeamMember"> | $Enums.TeamRole
    joinedAt?: DateTimeWithAggregatesFilter<"TeamMember"> | Date | string
  }

  export type TeamBanWhereInput = {
    AND?: TeamBanWhereInput | TeamBanWhereInput[]
    OR?: TeamBanWhereInput[]
    NOT?: TeamBanWhereInput | TeamBanWhereInput[]
    id?: StringFilter<"TeamBan"> | string
    teamId?: StringFilter<"TeamBan"> | string
    userId?: StringFilter<"TeamBan"> | string
    bannedAt?: DateTimeFilter<"TeamBan"> | Date | string
    reason?: StringNullableFilter<"TeamBan"> | string | null
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TeamBanOrderByWithRelationInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    bannedAt?: SortOrder
    reason?: SortOrderInput | SortOrder
    team?: TeamOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type TeamBanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    teamId_userId?: TeamBanTeamIdUserIdCompoundUniqueInput
    AND?: TeamBanWhereInput | TeamBanWhereInput[]
    OR?: TeamBanWhereInput[]
    NOT?: TeamBanWhereInput | TeamBanWhereInput[]
    teamId?: StringFilter<"TeamBan"> | string
    userId?: StringFilter<"TeamBan"> | string
    bannedAt?: DateTimeFilter<"TeamBan"> | Date | string
    reason?: StringNullableFilter<"TeamBan"> | string | null
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "teamId_userId">

  export type TeamBanOrderByWithAggregationInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    bannedAt?: SortOrder
    reason?: SortOrderInput | SortOrder
    _count?: TeamBanCountOrderByAggregateInput
    _max?: TeamBanMaxOrderByAggregateInput
    _min?: TeamBanMinOrderByAggregateInput
  }

  export type TeamBanScalarWhereWithAggregatesInput = {
    AND?: TeamBanScalarWhereWithAggregatesInput | TeamBanScalarWhereWithAggregatesInput[]
    OR?: TeamBanScalarWhereWithAggregatesInput[]
    NOT?: TeamBanScalarWhereWithAggregatesInput | TeamBanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TeamBan"> | string
    teamId?: StringWithAggregatesFilter<"TeamBan"> | string
    userId?: StringWithAggregatesFilter<"TeamBan"> | string
    bannedAt?: DateTimeWithAggregatesFilter<"TeamBan"> | Date | string
    reason?: StringNullableWithAggregatesFilter<"TeamBan"> | string | null
  }

  export type TeamRequestWhereInput = {
    AND?: TeamRequestWhereInput | TeamRequestWhereInput[]
    OR?: TeamRequestWhereInput[]
    NOT?: TeamRequestWhereInput | TeamRequestWhereInput[]
    id?: StringFilter<"TeamRequest"> | string
    teamId?: StringFilter<"TeamRequest"> | string
    userId?: StringFilter<"TeamRequest"> | string
    requestedAt?: DateTimeFilter<"TeamRequest"> | Date | string
    status?: EnumRequestStatusFilter<"TeamRequest"> | $Enums.RequestStatus
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TeamRequestOrderByWithRelationInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    requestedAt?: SortOrder
    status?: SortOrder
    team?: TeamOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type TeamRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    teamId_userId?: TeamRequestTeamIdUserIdCompoundUniqueInput
    AND?: TeamRequestWhereInput | TeamRequestWhereInput[]
    OR?: TeamRequestWhereInput[]
    NOT?: TeamRequestWhereInput | TeamRequestWhereInput[]
    teamId?: StringFilter<"TeamRequest"> | string
    userId?: StringFilter<"TeamRequest"> | string
    requestedAt?: DateTimeFilter<"TeamRequest"> | Date | string
    status?: EnumRequestStatusFilter<"TeamRequest"> | $Enums.RequestStatus
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "teamId_userId">

  export type TeamRequestOrderByWithAggregationInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    requestedAt?: SortOrder
    status?: SortOrder
    _count?: TeamRequestCountOrderByAggregateInput
    _max?: TeamRequestMaxOrderByAggregateInput
    _min?: TeamRequestMinOrderByAggregateInput
  }

  export type TeamRequestScalarWhereWithAggregatesInput = {
    AND?: TeamRequestScalarWhereWithAggregatesInput | TeamRequestScalarWhereWithAggregatesInput[]
    OR?: TeamRequestScalarWhereWithAggregatesInput[]
    NOT?: TeamRequestScalarWhereWithAggregatesInput | TeamRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TeamRequest"> | string
    teamId?: StringWithAggregatesFilter<"TeamRequest"> | string
    userId?: StringWithAggregatesFilter<"TeamRequest"> | string
    requestedAt?: DateTimeWithAggregatesFilter<"TeamRequest"> | Date | string
    status?: EnumRequestStatusWithAggregatesFilter<"TeamRequest"> | $Enums.RequestStatus
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    packages?: StringFilter<"Project"> | string
    type?: EnumProjectTypeFilter<"Project"> | $Enums.ProjectType
    isGitImport?: BoolFilter<"Project"> | boolean
    gitKey?: StringNullableFilter<"Project"> | string | null
    gitRepo?: StringNullableFilter<"Project"> | string | null
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    ownerId?: StringFilter<"Project"> | string
    teamId?: StringNullableFilter<"Project"> | string | null
    generatedById?: StringNullableFilter<"Project"> | string | null
    archeivedBy?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
    starredBy?: UserListRelationFilter
    archiveprojectBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    genratedProjectsby?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    files?: FileItemListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    packages?: SortOrder
    type?: SortOrder
    isGitImport?: SortOrder
    gitKey?: SortOrderInput | SortOrder
    gitRepo?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    ownerId?: SortOrder
    teamId?: SortOrderInput | SortOrder
    generatedById?: SortOrderInput | SortOrder
    archeivedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    team?: TeamOrderByWithRelationInput
    starredBy?: UserOrderByRelationAggregateInput
    archiveprojectBy?: UserOrderByWithRelationInput
    genratedProjectsby?: UserOrderByWithRelationInput
    files?: FileItemOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    packages?: StringFilter<"Project"> | string
    type?: EnumProjectTypeFilter<"Project"> | $Enums.ProjectType
    isGitImport?: BoolFilter<"Project"> | boolean
    gitKey?: StringNullableFilter<"Project"> | string | null
    gitRepo?: StringNullableFilter<"Project"> | string | null
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    ownerId?: StringFilter<"Project"> | string
    teamId?: StringNullableFilter<"Project"> | string | null
    generatedById?: StringNullableFilter<"Project"> | string | null
    archeivedBy?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
    starredBy?: UserListRelationFilter
    archiveprojectBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    genratedProjectsby?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    files?: FileItemListRelationFilter
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    packages?: SortOrder
    type?: SortOrder
    isGitImport?: SortOrder
    gitKey?: SortOrderInput | SortOrder
    gitRepo?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    ownerId?: SortOrder
    teamId?: SortOrderInput | SortOrder
    generatedById?: SortOrderInput | SortOrder
    archeivedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    description?: StringNullableWithAggregatesFilter<"Project"> | string | null
    packages?: StringWithAggregatesFilter<"Project"> | string
    type?: EnumProjectTypeWithAggregatesFilter<"Project"> | $Enums.ProjectType
    isGitImport?: BoolWithAggregatesFilter<"Project"> | boolean
    gitKey?: StringNullableWithAggregatesFilter<"Project"> | string | null
    gitRepo?: StringNullableWithAggregatesFilter<"Project"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    ownerId?: StringWithAggregatesFilter<"Project"> | string
    teamId?: StringNullableWithAggregatesFilter<"Project"> | string | null
    generatedById?: StringNullableWithAggregatesFilter<"Project"> | string | null
    archeivedBy?: StringNullableWithAggregatesFilter<"Project"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type FileItemWhereInput = {
    AND?: FileItemWhereInput | FileItemWhereInput[]
    OR?: FileItemWhereInput[]
    NOT?: FileItemWhereInput | FileItemWhereInput[]
    id?: StringFilter<"FileItem"> | string
    name?: StringFilter<"FileItem"> | string
    type?: StringFilter<"FileItem"> | string
    content?: StringFilter<"FileItem"> | string
    projectId?: StringFilter<"FileItem"> | string
    parentId?: StringNullableFilter<"FileItem"> | string | null
    createdAt?: DateTimeFilter<"FileItem"> | Date | string
    updatedAt?: DateTimeFilter<"FileItem"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    parent?: XOR<FileItemNullableScalarRelationFilter, FileItemWhereInput> | null
    children?: FileItemListRelationFilter
  }

  export type FileItemOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    content?: SortOrder
    projectId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    parent?: FileItemOrderByWithRelationInput
    children?: FileItemOrderByRelationAggregateInput
  }

  export type FileItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FileItemWhereInput | FileItemWhereInput[]
    OR?: FileItemWhereInput[]
    NOT?: FileItemWhereInput | FileItemWhereInput[]
    name?: StringFilter<"FileItem"> | string
    type?: StringFilter<"FileItem"> | string
    content?: StringFilter<"FileItem"> | string
    projectId?: StringFilter<"FileItem"> | string
    parentId?: StringNullableFilter<"FileItem"> | string | null
    createdAt?: DateTimeFilter<"FileItem"> | Date | string
    updatedAt?: DateTimeFilter<"FileItem"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    parent?: XOR<FileItemNullableScalarRelationFilter, FileItemWhereInput> | null
    children?: FileItemListRelationFilter
  }, "id">

  export type FileItemOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    content?: SortOrder
    projectId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FileItemCountOrderByAggregateInput
    _max?: FileItemMaxOrderByAggregateInput
    _min?: FileItemMinOrderByAggregateInput
  }

  export type FileItemScalarWhereWithAggregatesInput = {
    AND?: FileItemScalarWhereWithAggregatesInput | FileItemScalarWhereWithAggregatesInput[]
    OR?: FileItemScalarWhereWithAggregatesInput[]
    NOT?: FileItemScalarWhereWithAggregatesInput | FileItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FileItem"> | string
    name?: StringWithAggregatesFilter<"FileItem"> | string
    type?: StringWithAggregatesFilter<"FileItem"> | string
    content?: StringWithAggregatesFilter<"FileItem"> | string
    projectId?: StringWithAggregatesFilter<"FileItem"> | string
    parentId?: StringNullableWithAggregatesFilter<"FileItem"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FileItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FileItem"> | Date | string
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    senderId?: StringFilter<"Message"> | string
    dmChatRoomId?: StringNullableFilter<"Message"> | string | null
    teamId?: StringNullableFilter<"Message"> | string | null
    isRead?: BoolFilter<"Message"> | boolean
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    dmChatRoom?: XOR<FriendshipNullableScalarRelationFilter, FriendshipWhereInput> | null
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
    notifications?: NotificationListRelationFilter
    isDeletedBy?: UserListRelationFilter
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    senderId?: SortOrder
    dmChatRoomId?: SortOrderInput | SortOrder
    teamId?: SortOrderInput | SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sender?: UserOrderByWithRelationInput
    dmChatRoom?: FriendshipOrderByWithRelationInput
    team?: TeamOrderByWithRelationInput
    notifications?: NotificationOrderByRelationAggregateInput
    isDeletedBy?: UserOrderByRelationAggregateInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    content?: StringFilter<"Message"> | string
    senderId?: StringFilter<"Message"> | string
    dmChatRoomId?: StringNullableFilter<"Message"> | string | null
    teamId?: StringNullableFilter<"Message"> | string | null
    isRead?: BoolFilter<"Message"> | boolean
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    dmChatRoom?: XOR<FriendshipNullableScalarRelationFilter, FriendshipWhereInput> | null
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
    notifications?: NotificationListRelationFilter
    isDeletedBy?: UserListRelationFilter
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    senderId?: SortOrder
    dmChatRoomId?: SortOrderInput | SortOrder
    teamId?: SortOrderInput | SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    content?: StringWithAggregatesFilter<"Message"> | string
    senderId?: StringWithAggregatesFilter<"Message"> | string
    dmChatRoomId?: StringNullableWithAggregatesFilter<"Message"> | string | null
    teamId?: StringNullableWithAggregatesFilter<"Message"> | string | null
    isRead?: BoolWithAggregatesFilter<"Message"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    senderId?: StringFilter<"Notification"> | string
    receiverId?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    content?: StringNullableFilter<"Notification"> | string | null
    messageId?: StringNullableFilter<"Notification"> | string | null
    teamId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    updatedAt?: DateTimeFilter<"Notification"> | Date | string
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
    message?: XOR<MessageNullableScalarRelationFilter, MessageWhereInput> | null
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    type?: SortOrder
    content?: SortOrderInput | SortOrder
    messageId?: SortOrderInput | SortOrder
    teamId?: SortOrderInput | SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sender?: UserOrderByWithRelationInput
    receiver?: UserOrderByWithRelationInput
    message?: MessageOrderByWithRelationInput
    team?: TeamOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    senderId?: StringFilter<"Notification"> | string
    receiverId?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    content?: StringNullableFilter<"Notification"> | string | null
    messageId?: StringNullableFilter<"Notification"> | string | null
    teamId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    updatedAt?: DateTimeFilter<"Notification"> | Date | string
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
    message?: XOR<MessageNullableScalarRelationFilter, MessageWhereInput> | null
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    type?: SortOrder
    content?: SortOrderInput | SortOrder
    messageId?: SortOrderInput | SortOrder
    teamId?: SortOrderInput | SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    senderId?: StringWithAggregatesFilter<"Notification"> | string
    receiverId?: StringWithAggregatesFilter<"Notification"> | string
    type?: EnumNotificationTypeWithAggregatesFilter<"Notification"> | $Enums.NotificationType
    content?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    messageId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    teamId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    isRead?: BoolWithAggregatesFilter<"Notification"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectCreateNestedManyWithoutStarredByInput
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestCreateNestedManyWithoutUserInput
    teamBans?: TeamBanCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectUncheckedCreateNestedManyWithoutStarredByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestUncheckedCreateNestedManyWithoutUserInput
    teamBans?: TeamBanUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationUncheckedCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageUncheckedCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipUncheckedCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUncheckedUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUncheckedUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUncheckedUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FriendshipCreateInput = {
    id?: string
    status: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    initiator: UserCreateNestedOneWithoutFriendshipsInitiatedInput
    receiver: UserCreateNestedOneWithoutFriendshipsReceivedInput
    messages?: MessageCreateNestedManyWithoutDmChatRoomInput
  }

  export type FriendshipUncheckedCreateInput = {
    id?: string
    initiatorId: string
    receiverId: string
    status: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutDmChatRoomInput
  }

  export type FriendshipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    initiator?: UserUpdateOneRequiredWithoutFriendshipsInitiatedNestedInput
    receiver?: UserUpdateOneRequiredWithoutFriendshipsReceivedNestedInput
    messages?: MessageUpdateManyWithoutDmChatRoomNestedInput
  }

  export type FriendshipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutDmChatRoomNestedInput
  }

  export type FriendshipCreateManyInput = {
    id?: string
    initiatorId: string
    receiverId: string
    status: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamCreateInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberCreateNestedManyWithoutTeamInput
    bannedUsers?: TeamBanCreateNestedManyWithoutTeamInput
    pendingRequests?: TeamRequestCreateNestedManyWithoutTeamInput
    projects?: ProjectCreateNestedManyWithoutTeamInput
    messages?: MessageCreateNestedManyWithoutTeamInput
    notifications?: NotificationCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberUncheckedCreateNestedManyWithoutTeamInput
    bannedUsers?: TeamBanUncheckedCreateNestedManyWithoutTeamInput
    pendingRequests?: TeamRequestUncheckedCreateNestedManyWithoutTeamInput
    projects?: ProjectUncheckedCreateNestedManyWithoutTeamInput
    messages?: MessageUncheckedCreateNestedManyWithoutTeamInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUpdateManyWithoutTeamNestedInput
    bannedUsers?: TeamBanUpdateManyWithoutTeamNestedInput
    pendingRequests?: TeamRequestUpdateManyWithoutTeamNestedInput
    projects?: ProjectUpdateManyWithoutTeamNestedInput
    messages?: MessageUpdateManyWithoutTeamNestedInput
    notifications?: NotificationUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUncheckedUpdateManyWithoutTeamNestedInput
    bannedUsers?: TeamBanUncheckedUpdateManyWithoutTeamNestedInput
    pendingRequests?: TeamRequestUncheckedUpdateManyWithoutTeamNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutTeamNestedInput
    messages?: MessageUncheckedUpdateManyWithoutTeamNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type TeamCreateManyInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeamUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberCreateInput = {
    id?: string
    role: $Enums.TeamRole
    joinedAt?: Date | string
    team: TeamCreateNestedOneWithoutMembersInput
    user: UserCreateNestedOneWithoutTeamsInput
  }

  export type TeamMemberUncheckedCreateInput = {
    id?: string
    teamId: string
    userId: string
    role: $Enums.TeamRole
    joinedAt?: Date | string
  }

  export type TeamMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneRequiredWithoutTeamsNestedInput
  }

  export type TeamMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberCreateManyInput = {
    id?: string
    teamId: string
    userId: string
    role: $Enums.TeamRole
    joinedAt?: Date | string
  }

  export type TeamMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamBanCreateInput = {
    id?: string
    bannedAt?: Date | string
    reason?: string | null
    team: TeamCreateNestedOneWithoutBannedUsersInput
    user: UserCreateNestedOneWithoutTeamBansInput
  }

  export type TeamBanUncheckedCreateInput = {
    id?: string
    teamId: string
    userId: string
    bannedAt?: Date | string
    reason?: string | null
  }

  export type TeamBanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    team?: TeamUpdateOneRequiredWithoutBannedUsersNestedInput
    user?: UserUpdateOneRequiredWithoutTeamBansNestedInput
  }

  export type TeamBanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamBanCreateManyInput = {
    id?: string
    teamId: string
    userId: string
    bannedAt?: Date | string
    reason?: string | null
  }

  export type TeamBanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamBanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamRequestCreateInput = {
    id?: string
    requestedAt?: Date | string
    status: $Enums.RequestStatus
    team: TeamCreateNestedOneWithoutPendingRequestsInput
    user: UserCreateNestedOneWithoutTeamJoinRequestsInput
  }

  export type TeamRequestUncheckedCreateInput = {
    id?: string
    teamId: string
    userId: string
    requestedAt?: Date | string
    status: $Enums.RequestStatus
  }

  export type TeamRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    team?: TeamUpdateOneRequiredWithoutPendingRequestsNestedInput
    user?: UserUpdateOneRequiredWithoutTeamJoinRequestsNestedInput
  }

  export type TeamRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
  }

  export type TeamRequestCreateManyInput = {
    id?: string
    teamId: string
    userId: string
    requestedAt?: Date | string
    status: $Enums.RequestStatus
  }

  export type TeamRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
  }

  export type TeamRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
  }

  export type ProjectCreateInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    owner: UserCreateNestedOneWithoutProjectsInput
    team?: TeamCreateNestedOneWithoutProjectsInput
    starredBy?: UserCreateNestedManyWithoutStarredProjectsInput
    archiveprojectBy?: UserCreateNestedOneWithoutArchieveProjectsInput
    genratedProjectsby?: UserCreateNestedOneWithoutAppsGeneratedInput
    files?: FileItemCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    ownerId: string
    teamId?: string | null
    generatedById?: string | null
    archeivedBy?: string | null
    createdAt?: Date | string
    starredBy?: UserUncheckedCreateNestedManyWithoutStarredProjectsInput
    files?: FileItemUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutProjectsNestedInput
    team?: TeamUpdateOneWithoutProjectsNestedInput
    starredBy?: UserUpdateManyWithoutStarredProjectsNestedInput
    archiveprojectBy?: UserUpdateOneWithoutArchieveProjectsNestedInput
    genratedProjectsby?: UserUpdateOneWithoutAppsGeneratedNestedInput
    files?: FileItemUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerId?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    generatedById?: NullableStringFieldUpdateOperationsInput | string | null
    archeivedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    starredBy?: UserUncheckedUpdateManyWithoutStarredProjectsNestedInput
    files?: FileItemUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    ownerId: string
    teamId?: string | null
    generatedById?: string | null
    archeivedBy?: string | null
    createdAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerId?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    generatedById?: NullableStringFieldUpdateOperationsInput | string | null
    archeivedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileItemCreateInput = {
    id?: string
    name: string
    type: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutFilesInput
    parent?: FileItemCreateNestedOneWithoutChildrenInput
    children?: FileItemCreateNestedManyWithoutParentInput
  }

  export type FileItemUncheckedCreateInput = {
    id?: string
    name: string
    type: string
    content: string
    projectId: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: FileItemUncheckedCreateNestedManyWithoutParentInput
  }

  export type FileItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutFilesNestedInput
    parent?: FileItemUpdateOneWithoutChildrenNestedInput
    children?: FileItemUpdateManyWithoutParentNestedInput
  }

  export type FileItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: FileItemUncheckedUpdateManyWithoutParentNestedInput
  }

  export type FileItemCreateManyInput = {
    id?: string
    name: string
    type: string
    content: string
    projectId: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateInput = {
    id?: string
    content: string
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutSentMessagesInput
    dmChatRoom?: FriendshipCreateNestedOneWithoutMessagesInput
    team?: TeamCreateNestedOneWithoutMessagesInput
    notifications?: NotificationCreateNestedManyWithoutMessageInput
    isDeletedBy?: UserCreateNestedManyWithoutDeletedMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    content: string
    senderId: string
    dmChatRoomId?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutMessageInput
    isDeletedBy?: UserUncheckedCreateNestedManyWithoutDeletedMessagesInput
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput
    dmChatRoom?: FriendshipUpdateOneWithoutMessagesNestedInput
    team?: TeamUpdateOneWithoutMessagesNestedInput
    notifications?: NotificationUpdateManyWithoutMessageNestedInput
    isDeletedBy?: UserUpdateManyWithoutDeletedMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    dmChatRoomId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutMessageNestedInput
    isDeletedBy?: UserUncheckedUpdateManyWithoutDeletedMessagesNestedInput
  }

  export type MessageCreateManyInput = {
    id?: string
    content: string
    senderId: string
    dmChatRoomId?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    dmChatRoomId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    type?: $Enums.NotificationType
    content?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutSentNotificationsInput
    receiver: UserCreateNestedOneWithoutReceivedNotificationsInput
    message?: MessageCreateNestedOneWithoutNotificationsInput
    team?: TeamCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    senderId: string
    receiverId: string
    type?: $Enums.NotificationType
    content?: string | null
    messageId?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutSentNotificationsNestedInput
    receiver?: UserUpdateOneRequiredWithoutReceivedNotificationsNestedInput
    message?: MessageUpdateOneWithoutNotificationsNestedInput
    team?: TeamUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    messageId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    senderId: string
    receiverId: string
    type?: $Enums.NotificationType
    content?: string | null
    messageId?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    messageId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type TeamMemberListRelationFilter = {
    every?: TeamMemberWhereInput
    some?: TeamMemberWhereInput
    none?: TeamMemberWhereInput
  }

  export type TeamRequestListRelationFilter = {
    every?: TeamRequestWhereInput
    some?: TeamRequestWhereInput
    none?: TeamRequestWhereInput
  }

  export type TeamBanListRelationFilter = {
    every?: TeamBanWhereInput
    some?: TeamBanWhereInput
    none?: TeamBanWhereInput
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type FriendshipListRelationFilter = {
    every?: FriendshipWhereInput
    some?: FriendshipWhereInput
    none?: FriendshipWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TeamMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TeamRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TeamBanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FriendshipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    avatar?: SortOrder
    githubUrl?: SortOrder
    bio?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    avatar?: SortOrder
    githubUrl?: SortOrder
    bio?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    avatar?: SortOrder
    githubUrl?: SortOrder
    bio?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumFriendshipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusFilter<$PrismaModel> | $Enums.FriendshipStatus
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type FriendshipInitiatorIdReceiverIdCompoundUniqueInput = {
    initiatorId: string
    receiverId: string
  }

  export type FriendshipCountOrderByAggregateInput = {
    id?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FriendshipMaxOrderByAggregateInput = {
    id?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FriendshipMinOrderByAggregateInput = {
    id?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumFriendshipStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusWithAggregatesFilter<$PrismaModel> | $Enums.FriendshipStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFriendshipStatusFilter<$PrismaModel>
    _max?: NestedEnumFriendshipStatusFilter<$PrismaModel>
  }

  export type EnumTeamTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamType | EnumTeamTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TeamType[] | ListEnumTeamTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamType[] | ListEnumTeamTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamTypeFilter<$PrismaModel> | $Enums.TeamType
  }

  export type TeamCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TeamMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TeamMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTeamTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamType | EnumTeamTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TeamType[] | ListEnumTeamTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamType[] | ListEnumTeamTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamTypeWithAggregatesFilter<$PrismaModel> | $Enums.TeamType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTeamTypeFilter<$PrismaModel>
    _max?: NestedEnumTeamTypeFilter<$PrismaModel>
  }

  export type EnumTeamRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamRole | EnumTeamRoleFieldRefInput<$PrismaModel>
    in?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamRoleFilter<$PrismaModel> | $Enums.TeamRole
  }

  export type TeamScalarRelationFilter = {
    is?: TeamWhereInput
    isNot?: TeamWhereInput
  }

  export type TeamMemberTeamIdUserIdCompoundUniqueInput = {
    teamId: string
    userId: string
  }

  export type TeamMemberCountOrderByAggregateInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
  }

  export type TeamMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
  }

  export type TeamMemberMinOrderByAggregateInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
  }

  export type EnumTeamRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamRole | EnumTeamRoleFieldRefInput<$PrismaModel>
    in?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamRoleWithAggregatesFilter<$PrismaModel> | $Enums.TeamRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTeamRoleFilter<$PrismaModel>
    _max?: NestedEnumTeamRoleFilter<$PrismaModel>
  }

  export type TeamBanTeamIdUserIdCompoundUniqueInput = {
    teamId: string
    userId: string
  }

  export type TeamBanCountOrderByAggregateInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    bannedAt?: SortOrder
    reason?: SortOrder
  }

  export type TeamBanMaxOrderByAggregateInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    bannedAt?: SortOrder
    reason?: SortOrder
  }

  export type TeamBanMinOrderByAggregateInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    bannedAt?: SortOrder
    reason?: SortOrder
  }

  export type EnumRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusFilter<$PrismaModel> | $Enums.RequestStatus
  }

  export type TeamRequestTeamIdUserIdCompoundUniqueInput = {
    teamId: string
    userId: string
  }

  export type TeamRequestCountOrderByAggregateInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    requestedAt?: SortOrder
    status?: SortOrder
  }

  export type TeamRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    requestedAt?: SortOrder
    status?: SortOrder
  }

  export type TeamRequestMinOrderByAggregateInput = {
    id?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
    requestedAt?: SortOrder
    status?: SortOrder
  }

  export type EnumRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.RequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumRequestStatusFilter<$PrismaModel>
  }

  export type EnumProjectTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectType | EnumProjectTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectType[] | ListEnumProjectTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectType[] | ListEnumProjectTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectTypeFilter<$PrismaModel> | $Enums.ProjectType
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type TeamNullableScalarRelationFilter = {
    is?: TeamWhereInput | null
    isNot?: TeamWhereInput | null
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type FileItemListRelationFilter = {
    every?: FileItemWhereInput
    some?: FileItemWhereInput
    none?: FileItemWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FileItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    packages?: SortOrder
    type?: SortOrder
    isGitImport?: SortOrder
    gitKey?: SortOrder
    gitRepo?: SortOrder
    updatedAt?: SortOrder
    ownerId?: SortOrder
    teamId?: SortOrder
    generatedById?: SortOrder
    archeivedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    packages?: SortOrder
    type?: SortOrder
    isGitImport?: SortOrder
    gitKey?: SortOrder
    gitRepo?: SortOrder
    updatedAt?: SortOrder
    ownerId?: SortOrder
    teamId?: SortOrder
    generatedById?: SortOrder
    archeivedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    packages?: SortOrder
    type?: SortOrder
    isGitImport?: SortOrder
    gitKey?: SortOrder
    gitRepo?: SortOrder
    updatedAt?: SortOrder
    ownerId?: SortOrder
    teamId?: SortOrder
    generatedById?: SortOrder
    archeivedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumProjectTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectType | EnumProjectTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectType[] | ListEnumProjectTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectType[] | ListEnumProjectTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectTypeWithAggregatesFilter<$PrismaModel> | $Enums.ProjectType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectTypeFilter<$PrismaModel>
    _max?: NestedEnumProjectTypeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type FileItemNullableScalarRelationFilter = {
    is?: FileItemWhereInput | null
    isNot?: FileItemWhereInput | null
  }

  export type FileItemCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    content?: SortOrder
    projectId?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileItemMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    content?: SortOrder
    projectId?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileItemMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    content?: SortOrder
    projectId?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FriendshipNullableScalarRelationFilter = {
    is?: FriendshipWhereInput | null
    isNot?: FriendshipWhereInput | null
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    senderId?: SortOrder
    dmChatRoomId?: SortOrder
    teamId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    senderId?: SortOrder
    dmChatRoomId?: SortOrder
    teamId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    senderId?: SortOrder
    dmChatRoomId?: SortOrder
    teamId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type MessageNullableScalarRelationFilter = {
    is?: MessageWhereInput | null
    isNot?: MessageWhereInput | null
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    type?: SortOrder
    content?: SortOrder
    messageId?: SortOrder
    teamId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    type?: SortOrder
    content?: SortOrder
    messageId?: SortOrder
    teamId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    type?: SortOrder
    content?: SortOrder
    messageId?: SortOrder
    teamId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type ProjectCreateNestedManyWithoutArchiveprojectByInput = {
    create?: XOR<ProjectCreateWithoutArchiveprojectByInput, ProjectUncheckedCreateWithoutArchiveprojectByInput> | ProjectCreateWithoutArchiveprojectByInput[] | ProjectUncheckedCreateWithoutArchiveprojectByInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutArchiveprojectByInput | ProjectCreateOrConnectWithoutArchiveprojectByInput[]
    createMany?: ProjectCreateManyArchiveprojectByInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectCreateNestedManyWithoutGenratedProjectsbyInput = {
    create?: XOR<ProjectCreateWithoutGenratedProjectsbyInput, ProjectUncheckedCreateWithoutGenratedProjectsbyInput> | ProjectCreateWithoutGenratedProjectsbyInput[] | ProjectUncheckedCreateWithoutGenratedProjectsbyInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutGenratedProjectsbyInput | ProjectCreateOrConnectWithoutGenratedProjectsbyInput[]
    createMany?: ProjectCreateManyGenratedProjectsbyInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectCreateNestedManyWithoutStarredByInput = {
    create?: XOR<ProjectCreateWithoutStarredByInput, ProjectUncheckedCreateWithoutStarredByInput> | ProjectCreateWithoutStarredByInput[] | ProjectUncheckedCreateWithoutStarredByInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutStarredByInput | ProjectCreateOrConnectWithoutStarredByInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type TeamMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput> | TeamMemberCreateWithoutUserInput[] | TeamMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutUserInput | TeamMemberCreateOrConnectWithoutUserInput[]
    createMany?: TeamMemberCreateManyUserInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type TeamRequestCreateNestedManyWithoutUserInput = {
    create?: XOR<TeamRequestCreateWithoutUserInput, TeamRequestUncheckedCreateWithoutUserInput> | TeamRequestCreateWithoutUserInput[] | TeamRequestUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamRequestCreateOrConnectWithoutUserInput | TeamRequestCreateOrConnectWithoutUserInput[]
    createMany?: TeamRequestCreateManyUserInputEnvelope
    connect?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
  }

  export type TeamBanCreateNestedManyWithoutUserInput = {
    create?: XOR<TeamBanCreateWithoutUserInput, TeamBanUncheckedCreateWithoutUserInput> | TeamBanCreateWithoutUserInput[] | TeamBanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamBanCreateOrConnectWithoutUserInput | TeamBanCreateOrConnectWithoutUserInput[]
    createMany?: TeamBanCreateManyUserInputEnvelope
    connect?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutSenderInput = {
    create?: XOR<NotificationCreateWithoutSenderInput, NotificationUncheckedCreateWithoutSenderInput> | NotificationCreateWithoutSenderInput[] | NotificationUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutSenderInput | NotificationCreateOrConnectWithoutSenderInput[]
    createMany?: NotificationCreateManySenderInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutReceiverInput = {
    create?: XOR<NotificationCreateWithoutReceiverInput, NotificationUncheckedCreateWithoutReceiverInput> | NotificationCreateWithoutReceiverInput[] | NotificationUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutReceiverInput | NotificationCreateOrConnectWithoutReceiverInput[]
    createMany?: NotificationCreateManyReceiverInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutIsDeletedByInput = {
    create?: XOR<MessageCreateWithoutIsDeletedByInput, MessageUncheckedCreateWithoutIsDeletedByInput> | MessageCreateWithoutIsDeletedByInput[] | MessageUncheckedCreateWithoutIsDeletedByInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutIsDeletedByInput | MessageCreateOrConnectWithoutIsDeletedByInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type FriendshipCreateNestedManyWithoutInitiatorInput = {
    create?: XOR<FriendshipCreateWithoutInitiatorInput, FriendshipUncheckedCreateWithoutInitiatorInput> | FriendshipCreateWithoutInitiatorInput[] | FriendshipUncheckedCreateWithoutInitiatorInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutInitiatorInput | FriendshipCreateOrConnectWithoutInitiatorInput[]
    createMany?: FriendshipCreateManyInitiatorInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type FriendshipCreateNestedManyWithoutReceiverInput = {
    create?: XOR<FriendshipCreateWithoutReceiverInput, FriendshipUncheckedCreateWithoutReceiverInput> | FriendshipCreateWithoutReceiverInput[] | FriendshipUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutReceiverInput | FriendshipCreateOrConnectWithoutReceiverInput[]
    createMany?: FriendshipCreateManyReceiverInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput = {
    create?: XOR<ProjectCreateWithoutArchiveprojectByInput, ProjectUncheckedCreateWithoutArchiveprojectByInput> | ProjectCreateWithoutArchiveprojectByInput[] | ProjectUncheckedCreateWithoutArchiveprojectByInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutArchiveprojectByInput | ProjectCreateOrConnectWithoutArchiveprojectByInput[]
    createMany?: ProjectCreateManyArchiveprojectByInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput = {
    create?: XOR<ProjectCreateWithoutGenratedProjectsbyInput, ProjectUncheckedCreateWithoutGenratedProjectsbyInput> | ProjectCreateWithoutGenratedProjectsbyInput[] | ProjectUncheckedCreateWithoutGenratedProjectsbyInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutGenratedProjectsbyInput | ProjectCreateOrConnectWithoutGenratedProjectsbyInput[]
    createMany?: ProjectCreateManyGenratedProjectsbyInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutStarredByInput = {
    create?: XOR<ProjectCreateWithoutStarredByInput, ProjectUncheckedCreateWithoutStarredByInput> | ProjectCreateWithoutStarredByInput[] | ProjectUncheckedCreateWithoutStarredByInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutStarredByInput | ProjectCreateOrConnectWithoutStarredByInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type TeamMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput> | TeamMemberCreateWithoutUserInput[] | TeamMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutUserInput | TeamMemberCreateOrConnectWithoutUserInput[]
    createMany?: TeamMemberCreateManyUserInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type TeamRequestUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TeamRequestCreateWithoutUserInput, TeamRequestUncheckedCreateWithoutUserInput> | TeamRequestCreateWithoutUserInput[] | TeamRequestUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamRequestCreateOrConnectWithoutUserInput | TeamRequestCreateOrConnectWithoutUserInput[]
    createMany?: TeamRequestCreateManyUserInputEnvelope
    connect?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
  }

  export type TeamBanUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TeamBanCreateWithoutUserInput, TeamBanUncheckedCreateWithoutUserInput> | TeamBanCreateWithoutUserInput[] | TeamBanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamBanCreateOrConnectWithoutUserInput | TeamBanCreateOrConnectWithoutUserInput[]
    createMany?: TeamBanCreateManyUserInputEnvelope
    connect?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<NotificationCreateWithoutSenderInput, NotificationUncheckedCreateWithoutSenderInput> | NotificationCreateWithoutSenderInput[] | NotificationUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutSenderInput | NotificationCreateOrConnectWithoutSenderInput[]
    createMany?: NotificationCreateManySenderInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutReceiverInput = {
    create?: XOR<NotificationCreateWithoutReceiverInput, NotificationUncheckedCreateWithoutReceiverInput> | NotificationCreateWithoutReceiverInput[] | NotificationUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutReceiverInput | NotificationCreateOrConnectWithoutReceiverInput[]
    createMany?: NotificationCreateManyReceiverInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutIsDeletedByInput = {
    create?: XOR<MessageCreateWithoutIsDeletedByInput, MessageUncheckedCreateWithoutIsDeletedByInput> | MessageCreateWithoutIsDeletedByInput[] | MessageUncheckedCreateWithoutIsDeletedByInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutIsDeletedByInput | MessageCreateOrConnectWithoutIsDeletedByInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type FriendshipUncheckedCreateNestedManyWithoutInitiatorInput = {
    create?: XOR<FriendshipCreateWithoutInitiatorInput, FriendshipUncheckedCreateWithoutInitiatorInput> | FriendshipCreateWithoutInitiatorInput[] | FriendshipUncheckedCreateWithoutInitiatorInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutInitiatorInput | FriendshipCreateOrConnectWithoutInitiatorInput[]
    createMany?: FriendshipCreateManyInitiatorInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type FriendshipUncheckedCreateNestedManyWithoutReceiverInput = {
    create?: XOR<FriendshipCreateWithoutReceiverInput, FriendshipUncheckedCreateWithoutReceiverInput> | FriendshipCreateWithoutReceiverInput[] | FriendshipUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutReceiverInput | FriendshipCreateOrConnectWithoutReceiverInput[]
    createMany?: FriendshipCreateManyReceiverInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProjectUpdateManyWithoutArchiveprojectByNestedInput = {
    create?: XOR<ProjectCreateWithoutArchiveprojectByInput, ProjectUncheckedCreateWithoutArchiveprojectByInput> | ProjectCreateWithoutArchiveprojectByInput[] | ProjectUncheckedCreateWithoutArchiveprojectByInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutArchiveprojectByInput | ProjectCreateOrConnectWithoutArchiveprojectByInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutArchiveprojectByInput | ProjectUpsertWithWhereUniqueWithoutArchiveprojectByInput[]
    createMany?: ProjectCreateManyArchiveprojectByInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutArchiveprojectByInput | ProjectUpdateWithWhereUniqueWithoutArchiveprojectByInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutArchiveprojectByInput | ProjectUpdateManyWithWhereWithoutArchiveprojectByInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectUpdateManyWithoutGenratedProjectsbyNestedInput = {
    create?: XOR<ProjectCreateWithoutGenratedProjectsbyInput, ProjectUncheckedCreateWithoutGenratedProjectsbyInput> | ProjectCreateWithoutGenratedProjectsbyInput[] | ProjectUncheckedCreateWithoutGenratedProjectsbyInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutGenratedProjectsbyInput | ProjectCreateOrConnectWithoutGenratedProjectsbyInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutGenratedProjectsbyInput | ProjectUpsertWithWhereUniqueWithoutGenratedProjectsbyInput[]
    createMany?: ProjectCreateManyGenratedProjectsbyInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutGenratedProjectsbyInput | ProjectUpdateWithWhereUniqueWithoutGenratedProjectsbyInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutGenratedProjectsbyInput | ProjectUpdateManyWithWhereWithoutGenratedProjectsbyInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectUpdateManyWithoutStarredByNestedInput = {
    create?: XOR<ProjectCreateWithoutStarredByInput, ProjectUncheckedCreateWithoutStarredByInput> | ProjectCreateWithoutStarredByInput[] | ProjectUncheckedCreateWithoutStarredByInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutStarredByInput | ProjectCreateOrConnectWithoutStarredByInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutStarredByInput | ProjectUpsertWithWhereUniqueWithoutStarredByInput[]
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutStarredByInput | ProjectUpdateWithWhereUniqueWithoutStarredByInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutStarredByInput | ProjectUpdateManyWithWhereWithoutStarredByInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutOwnerInput | ProjectUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutOwnerInput | ProjectUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutOwnerInput | ProjectUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type TeamMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput> | TeamMemberCreateWithoutUserInput[] | TeamMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutUserInput | TeamMemberCreateOrConnectWithoutUserInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutUserInput | TeamMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TeamMemberCreateManyUserInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutUserInput | TeamMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutUserInput | TeamMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type TeamRequestUpdateManyWithoutUserNestedInput = {
    create?: XOR<TeamRequestCreateWithoutUserInput, TeamRequestUncheckedCreateWithoutUserInput> | TeamRequestCreateWithoutUserInput[] | TeamRequestUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamRequestCreateOrConnectWithoutUserInput | TeamRequestCreateOrConnectWithoutUserInput[]
    upsert?: TeamRequestUpsertWithWhereUniqueWithoutUserInput | TeamRequestUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TeamRequestCreateManyUserInputEnvelope
    set?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    disconnect?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    delete?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    connect?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    update?: TeamRequestUpdateWithWhereUniqueWithoutUserInput | TeamRequestUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TeamRequestUpdateManyWithWhereWithoutUserInput | TeamRequestUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TeamRequestScalarWhereInput | TeamRequestScalarWhereInput[]
  }

  export type TeamBanUpdateManyWithoutUserNestedInput = {
    create?: XOR<TeamBanCreateWithoutUserInput, TeamBanUncheckedCreateWithoutUserInput> | TeamBanCreateWithoutUserInput[] | TeamBanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamBanCreateOrConnectWithoutUserInput | TeamBanCreateOrConnectWithoutUserInput[]
    upsert?: TeamBanUpsertWithWhereUniqueWithoutUserInput | TeamBanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TeamBanCreateManyUserInputEnvelope
    set?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    disconnect?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    delete?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    connect?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    update?: TeamBanUpdateWithWhereUniqueWithoutUserInput | TeamBanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TeamBanUpdateManyWithWhereWithoutUserInput | TeamBanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TeamBanScalarWhereInput | TeamBanScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutSenderNestedInput = {
    create?: XOR<NotificationCreateWithoutSenderInput, NotificationUncheckedCreateWithoutSenderInput> | NotificationCreateWithoutSenderInput[] | NotificationUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutSenderInput | NotificationCreateOrConnectWithoutSenderInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutSenderInput | NotificationUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: NotificationCreateManySenderInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutSenderInput | NotificationUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutSenderInput | NotificationUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<NotificationCreateWithoutReceiverInput, NotificationUncheckedCreateWithoutReceiverInput> | NotificationCreateWithoutReceiverInput[] | NotificationUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutReceiverInput | NotificationCreateOrConnectWithoutReceiverInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutReceiverInput | NotificationUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: NotificationCreateManyReceiverInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutReceiverInput | NotificationUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutReceiverInput | NotificationUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutIsDeletedByNestedInput = {
    create?: XOR<MessageCreateWithoutIsDeletedByInput, MessageUncheckedCreateWithoutIsDeletedByInput> | MessageCreateWithoutIsDeletedByInput[] | MessageUncheckedCreateWithoutIsDeletedByInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutIsDeletedByInput | MessageCreateOrConnectWithoutIsDeletedByInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutIsDeletedByInput | MessageUpsertWithWhereUniqueWithoutIsDeletedByInput[]
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutIsDeletedByInput | MessageUpdateWithWhereUniqueWithoutIsDeletedByInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutIsDeletedByInput | MessageUpdateManyWithWhereWithoutIsDeletedByInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type FriendshipUpdateManyWithoutInitiatorNestedInput = {
    create?: XOR<FriendshipCreateWithoutInitiatorInput, FriendshipUncheckedCreateWithoutInitiatorInput> | FriendshipCreateWithoutInitiatorInput[] | FriendshipUncheckedCreateWithoutInitiatorInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutInitiatorInput | FriendshipCreateOrConnectWithoutInitiatorInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutInitiatorInput | FriendshipUpsertWithWhereUniqueWithoutInitiatorInput[]
    createMany?: FriendshipCreateManyInitiatorInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutInitiatorInput | FriendshipUpdateWithWhereUniqueWithoutInitiatorInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutInitiatorInput | FriendshipUpdateManyWithWhereWithoutInitiatorInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type FriendshipUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<FriendshipCreateWithoutReceiverInput, FriendshipUncheckedCreateWithoutReceiverInput> | FriendshipCreateWithoutReceiverInput[] | FriendshipUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutReceiverInput | FriendshipCreateOrConnectWithoutReceiverInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutReceiverInput | FriendshipUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: FriendshipCreateManyReceiverInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutReceiverInput | FriendshipUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutReceiverInput | FriendshipUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput = {
    create?: XOR<ProjectCreateWithoutArchiveprojectByInput, ProjectUncheckedCreateWithoutArchiveprojectByInput> | ProjectCreateWithoutArchiveprojectByInput[] | ProjectUncheckedCreateWithoutArchiveprojectByInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutArchiveprojectByInput | ProjectCreateOrConnectWithoutArchiveprojectByInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutArchiveprojectByInput | ProjectUpsertWithWhereUniqueWithoutArchiveprojectByInput[]
    createMany?: ProjectCreateManyArchiveprojectByInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutArchiveprojectByInput | ProjectUpdateWithWhereUniqueWithoutArchiveprojectByInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutArchiveprojectByInput | ProjectUpdateManyWithWhereWithoutArchiveprojectByInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput = {
    create?: XOR<ProjectCreateWithoutGenratedProjectsbyInput, ProjectUncheckedCreateWithoutGenratedProjectsbyInput> | ProjectCreateWithoutGenratedProjectsbyInput[] | ProjectUncheckedCreateWithoutGenratedProjectsbyInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutGenratedProjectsbyInput | ProjectCreateOrConnectWithoutGenratedProjectsbyInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutGenratedProjectsbyInput | ProjectUpsertWithWhereUniqueWithoutGenratedProjectsbyInput[]
    createMany?: ProjectCreateManyGenratedProjectsbyInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutGenratedProjectsbyInput | ProjectUpdateWithWhereUniqueWithoutGenratedProjectsbyInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutGenratedProjectsbyInput | ProjectUpdateManyWithWhereWithoutGenratedProjectsbyInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutStarredByNestedInput = {
    create?: XOR<ProjectCreateWithoutStarredByInput, ProjectUncheckedCreateWithoutStarredByInput> | ProjectCreateWithoutStarredByInput[] | ProjectUncheckedCreateWithoutStarredByInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutStarredByInput | ProjectCreateOrConnectWithoutStarredByInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutStarredByInput | ProjectUpsertWithWhereUniqueWithoutStarredByInput[]
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutStarredByInput | ProjectUpdateWithWhereUniqueWithoutStarredByInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutStarredByInput | ProjectUpdateManyWithWhereWithoutStarredByInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutOwnerInput | ProjectUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutOwnerInput | ProjectUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutOwnerInput | ProjectUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type TeamMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput> | TeamMemberCreateWithoutUserInput[] | TeamMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutUserInput | TeamMemberCreateOrConnectWithoutUserInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutUserInput | TeamMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TeamMemberCreateManyUserInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutUserInput | TeamMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutUserInput | TeamMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type TeamRequestUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TeamRequestCreateWithoutUserInput, TeamRequestUncheckedCreateWithoutUserInput> | TeamRequestCreateWithoutUserInput[] | TeamRequestUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamRequestCreateOrConnectWithoutUserInput | TeamRequestCreateOrConnectWithoutUserInput[]
    upsert?: TeamRequestUpsertWithWhereUniqueWithoutUserInput | TeamRequestUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TeamRequestCreateManyUserInputEnvelope
    set?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    disconnect?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    delete?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    connect?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    update?: TeamRequestUpdateWithWhereUniqueWithoutUserInput | TeamRequestUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TeamRequestUpdateManyWithWhereWithoutUserInput | TeamRequestUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TeamRequestScalarWhereInput | TeamRequestScalarWhereInput[]
  }

  export type TeamBanUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TeamBanCreateWithoutUserInput, TeamBanUncheckedCreateWithoutUserInput> | TeamBanCreateWithoutUserInput[] | TeamBanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamBanCreateOrConnectWithoutUserInput | TeamBanCreateOrConnectWithoutUserInput[]
    upsert?: TeamBanUpsertWithWhereUniqueWithoutUserInput | TeamBanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TeamBanCreateManyUserInputEnvelope
    set?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    disconnect?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    delete?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    connect?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    update?: TeamBanUpdateWithWhereUniqueWithoutUserInput | TeamBanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TeamBanUpdateManyWithWhereWithoutUserInput | TeamBanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TeamBanScalarWhereInput | TeamBanScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<NotificationCreateWithoutSenderInput, NotificationUncheckedCreateWithoutSenderInput> | NotificationCreateWithoutSenderInput[] | NotificationUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutSenderInput | NotificationCreateOrConnectWithoutSenderInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutSenderInput | NotificationUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: NotificationCreateManySenderInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutSenderInput | NotificationUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutSenderInput | NotificationUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<NotificationCreateWithoutReceiverInput, NotificationUncheckedCreateWithoutReceiverInput> | NotificationCreateWithoutReceiverInput[] | NotificationUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutReceiverInput | NotificationCreateOrConnectWithoutReceiverInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutReceiverInput | NotificationUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: NotificationCreateManyReceiverInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutReceiverInput | NotificationUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutReceiverInput | NotificationUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput = {
    create?: XOR<MessageCreateWithoutIsDeletedByInput, MessageUncheckedCreateWithoutIsDeletedByInput> | MessageCreateWithoutIsDeletedByInput[] | MessageUncheckedCreateWithoutIsDeletedByInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutIsDeletedByInput | MessageCreateOrConnectWithoutIsDeletedByInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutIsDeletedByInput | MessageUpsertWithWhereUniqueWithoutIsDeletedByInput[]
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutIsDeletedByInput | MessageUpdateWithWhereUniqueWithoutIsDeletedByInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutIsDeletedByInput | MessageUpdateManyWithWhereWithoutIsDeletedByInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput = {
    create?: XOR<FriendshipCreateWithoutInitiatorInput, FriendshipUncheckedCreateWithoutInitiatorInput> | FriendshipCreateWithoutInitiatorInput[] | FriendshipUncheckedCreateWithoutInitiatorInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutInitiatorInput | FriendshipCreateOrConnectWithoutInitiatorInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutInitiatorInput | FriendshipUpsertWithWhereUniqueWithoutInitiatorInput[]
    createMany?: FriendshipCreateManyInitiatorInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutInitiatorInput | FriendshipUpdateWithWhereUniqueWithoutInitiatorInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutInitiatorInput | FriendshipUpdateManyWithWhereWithoutInitiatorInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type FriendshipUncheckedUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<FriendshipCreateWithoutReceiverInput, FriendshipUncheckedCreateWithoutReceiverInput> | FriendshipCreateWithoutReceiverInput[] | FriendshipUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutReceiverInput | FriendshipCreateOrConnectWithoutReceiverInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutReceiverInput | FriendshipUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: FriendshipCreateManyReceiverInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutReceiverInput | FriendshipUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutReceiverInput | FriendshipUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutFriendshipsInitiatedInput = {
    create?: XOR<UserCreateWithoutFriendshipsInitiatedInput, UserUncheckedCreateWithoutFriendshipsInitiatedInput>
    connectOrCreate?: UserCreateOrConnectWithoutFriendshipsInitiatedInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutFriendshipsReceivedInput = {
    create?: XOR<UserCreateWithoutFriendshipsReceivedInput, UserUncheckedCreateWithoutFriendshipsReceivedInput>
    connectOrCreate?: UserCreateOrConnectWithoutFriendshipsReceivedInput
    connect?: UserWhereUniqueInput
  }

  export type MessageCreateNestedManyWithoutDmChatRoomInput = {
    create?: XOR<MessageCreateWithoutDmChatRoomInput, MessageUncheckedCreateWithoutDmChatRoomInput> | MessageCreateWithoutDmChatRoomInput[] | MessageUncheckedCreateWithoutDmChatRoomInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutDmChatRoomInput | MessageCreateOrConnectWithoutDmChatRoomInput[]
    createMany?: MessageCreateManyDmChatRoomInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutDmChatRoomInput = {
    create?: XOR<MessageCreateWithoutDmChatRoomInput, MessageUncheckedCreateWithoutDmChatRoomInput> | MessageCreateWithoutDmChatRoomInput[] | MessageUncheckedCreateWithoutDmChatRoomInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutDmChatRoomInput | MessageCreateOrConnectWithoutDmChatRoomInput[]
    createMany?: MessageCreateManyDmChatRoomInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type EnumFriendshipStatusFieldUpdateOperationsInput = {
    set?: $Enums.FriendshipStatus
  }

  export type UserUpdateOneRequiredWithoutFriendshipsInitiatedNestedInput = {
    create?: XOR<UserCreateWithoutFriendshipsInitiatedInput, UserUncheckedCreateWithoutFriendshipsInitiatedInput>
    connectOrCreate?: UserCreateOrConnectWithoutFriendshipsInitiatedInput
    upsert?: UserUpsertWithoutFriendshipsInitiatedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFriendshipsInitiatedInput, UserUpdateWithoutFriendshipsInitiatedInput>, UserUncheckedUpdateWithoutFriendshipsInitiatedInput>
  }

  export type UserUpdateOneRequiredWithoutFriendshipsReceivedNestedInput = {
    create?: XOR<UserCreateWithoutFriendshipsReceivedInput, UserUncheckedCreateWithoutFriendshipsReceivedInput>
    connectOrCreate?: UserCreateOrConnectWithoutFriendshipsReceivedInput
    upsert?: UserUpsertWithoutFriendshipsReceivedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFriendshipsReceivedInput, UserUpdateWithoutFriendshipsReceivedInput>, UserUncheckedUpdateWithoutFriendshipsReceivedInput>
  }

  export type MessageUpdateManyWithoutDmChatRoomNestedInput = {
    create?: XOR<MessageCreateWithoutDmChatRoomInput, MessageUncheckedCreateWithoutDmChatRoomInput> | MessageCreateWithoutDmChatRoomInput[] | MessageUncheckedCreateWithoutDmChatRoomInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutDmChatRoomInput | MessageCreateOrConnectWithoutDmChatRoomInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutDmChatRoomInput | MessageUpsertWithWhereUniqueWithoutDmChatRoomInput[]
    createMany?: MessageCreateManyDmChatRoomInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutDmChatRoomInput | MessageUpdateWithWhereUniqueWithoutDmChatRoomInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutDmChatRoomInput | MessageUpdateManyWithWhereWithoutDmChatRoomInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutDmChatRoomNestedInput = {
    create?: XOR<MessageCreateWithoutDmChatRoomInput, MessageUncheckedCreateWithoutDmChatRoomInput> | MessageCreateWithoutDmChatRoomInput[] | MessageUncheckedCreateWithoutDmChatRoomInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutDmChatRoomInput | MessageCreateOrConnectWithoutDmChatRoomInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutDmChatRoomInput | MessageUpsertWithWhereUniqueWithoutDmChatRoomInput[]
    createMany?: MessageCreateManyDmChatRoomInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutDmChatRoomInput | MessageUpdateWithWhereUniqueWithoutDmChatRoomInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutDmChatRoomInput | MessageUpdateManyWithWhereWithoutDmChatRoomInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type TeamMemberCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type TeamBanCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamBanCreateWithoutTeamInput, TeamBanUncheckedCreateWithoutTeamInput> | TeamBanCreateWithoutTeamInput[] | TeamBanUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamBanCreateOrConnectWithoutTeamInput | TeamBanCreateOrConnectWithoutTeamInput[]
    createMany?: TeamBanCreateManyTeamInputEnvelope
    connect?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
  }

  export type TeamRequestCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamRequestCreateWithoutTeamInput, TeamRequestUncheckedCreateWithoutTeamInput> | TeamRequestCreateWithoutTeamInput[] | TeamRequestUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamRequestCreateOrConnectWithoutTeamInput | TeamRequestCreateOrConnectWithoutTeamInput[]
    createMany?: TeamRequestCreateManyTeamInputEnvelope
    connect?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
  }

  export type ProjectCreateNestedManyWithoutTeamInput = {
    create?: XOR<ProjectCreateWithoutTeamInput, ProjectUncheckedCreateWithoutTeamInput> | ProjectCreateWithoutTeamInput[] | ProjectUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutTeamInput | ProjectCreateOrConnectWithoutTeamInput[]
    createMany?: ProjectCreateManyTeamInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutTeamInput = {
    create?: XOR<MessageCreateWithoutTeamInput, MessageUncheckedCreateWithoutTeamInput> | MessageCreateWithoutTeamInput[] | MessageUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutTeamInput | MessageCreateOrConnectWithoutTeamInput[]
    createMany?: MessageCreateManyTeamInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutTeamInput = {
    create?: XOR<NotificationCreateWithoutTeamInput, NotificationUncheckedCreateWithoutTeamInput> | NotificationCreateWithoutTeamInput[] | NotificationUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTeamInput | NotificationCreateOrConnectWithoutTeamInput[]
    createMany?: NotificationCreateManyTeamInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type TeamMemberUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type TeamBanUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamBanCreateWithoutTeamInput, TeamBanUncheckedCreateWithoutTeamInput> | TeamBanCreateWithoutTeamInput[] | TeamBanUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamBanCreateOrConnectWithoutTeamInput | TeamBanCreateOrConnectWithoutTeamInput[]
    createMany?: TeamBanCreateManyTeamInputEnvelope
    connect?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
  }

  export type TeamRequestUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamRequestCreateWithoutTeamInput, TeamRequestUncheckedCreateWithoutTeamInput> | TeamRequestCreateWithoutTeamInput[] | TeamRequestUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamRequestCreateOrConnectWithoutTeamInput | TeamRequestCreateOrConnectWithoutTeamInput[]
    createMany?: TeamRequestCreateManyTeamInputEnvelope
    connect?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<ProjectCreateWithoutTeamInput, ProjectUncheckedCreateWithoutTeamInput> | ProjectCreateWithoutTeamInput[] | ProjectUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutTeamInput | ProjectCreateOrConnectWithoutTeamInput[]
    createMany?: ProjectCreateManyTeamInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<MessageCreateWithoutTeamInput, MessageUncheckedCreateWithoutTeamInput> | MessageCreateWithoutTeamInput[] | MessageUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutTeamInput | MessageCreateOrConnectWithoutTeamInput[]
    createMany?: MessageCreateManyTeamInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<NotificationCreateWithoutTeamInput, NotificationUncheckedCreateWithoutTeamInput> | NotificationCreateWithoutTeamInput[] | NotificationUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTeamInput | NotificationCreateOrConnectWithoutTeamInput[]
    createMany?: NotificationCreateManyTeamInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type EnumTeamTypeFieldUpdateOperationsInput = {
    set?: $Enums.TeamType
  }

  export type TeamMemberUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutTeamInput | TeamMemberUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutTeamInput | TeamMemberUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutTeamInput | TeamMemberUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type TeamBanUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamBanCreateWithoutTeamInput, TeamBanUncheckedCreateWithoutTeamInput> | TeamBanCreateWithoutTeamInput[] | TeamBanUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamBanCreateOrConnectWithoutTeamInput | TeamBanCreateOrConnectWithoutTeamInput[]
    upsert?: TeamBanUpsertWithWhereUniqueWithoutTeamInput | TeamBanUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamBanCreateManyTeamInputEnvelope
    set?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    disconnect?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    delete?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    connect?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    update?: TeamBanUpdateWithWhereUniqueWithoutTeamInput | TeamBanUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamBanUpdateManyWithWhereWithoutTeamInput | TeamBanUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamBanScalarWhereInput | TeamBanScalarWhereInput[]
  }

  export type TeamRequestUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamRequestCreateWithoutTeamInput, TeamRequestUncheckedCreateWithoutTeamInput> | TeamRequestCreateWithoutTeamInput[] | TeamRequestUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamRequestCreateOrConnectWithoutTeamInput | TeamRequestCreateOrConnectWithoutTeamInput[]
    upsert?: TeamRequestUpsertWithWhereUniqueWithoutTeamInput | TeamRequestUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamRequestCreateManyTeamInputEnvelope
    set?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    disconnect?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    delete?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    connect?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    update?: TeamRequestUpdateWithWhereUniqueWithoutTeamInput | TeamRequestUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamRequestUpdateManyWithWhereWithoutTeamInput | TeamRequestUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamRequestScalarWhereInput | TeamRequestScalarWhereInput[]
  }

  export type ProjectUpdateManyWithoutTeamNestedInput = {
    create?: XOR<ProjectCreateWithoutTeamInput, ProjectUncheckedCreateWithoutTeamInput> | ProjectCreateWithoutTeamInput[] | ProjectUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutTeamInput | ProjectCreateOrConnectWithoutTeamInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutTeamInput | ProjectUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: ProjectCreateManyTeamInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutTeamInput | ProjectUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutTeamInput | ProjectUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutTeamNestedInput = {
    create?: XOR<MessageCreateWithoutTeamInput, MessageUncheckedCreateWithoutTeamInput> | MessageCreateWithoutTeamInput[] | MessageUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutTeamInput | MessageCreateOrConnectWithoutTeamInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutTeamInput | MessageUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: MessageCreateManyTeamInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutTeamInput | MessageUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutTeamInput | MessageUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutTeamNestedInput = {
    create?: XOR<NotificationCreateWithoutTeamInput, NotificationUncheckedCreateWithoutTeamInput> | NotificationCreateWithoutTeamInput[] | NotificationUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTeamInput | NotificationCreateOrConnectWithoutTeamInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutTeamInput | NotificationUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: NotificationCreateManyTeamInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutTeamInput | NotificationUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutTeamInput | NotificationUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type TeamMemberUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutTeamInput | TeamMemberUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutTeamInput | TeamMemberUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutTeamInput | TeamMemberUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type TeamBanUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamBanCreateWithoutTeamInput, TeamBanUncheckedCreateWithoutTeamInput> | TeamBanCreateWithoutTeamInput[] | TeamBanUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamBanCreateOrConnectWithoutTeamInput | TeamBanCreateOrConnectWithoutTeamInput[]
    upsert?: TeamBanUpsertWithWhereUniqueWithoutTeamInput | TeamBanUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamBanCreateManyTeamInputEnvelope
    set?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    disconnect?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    delete?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    connect?: TeamBanWhereUniqueInput | TeamBanWhereUniqueInput[]
    update?: TeamBanUpdateWithWhereUniqueWithoutTeamInput | TeamBanUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamBanUpdateManyWithWhereWithoutTeamInput | TeamBanUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamBanScalarWhereInput | TeamBanScalarWhereInput[]
  }

  export type TeamRequestUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamRequestCreateWithoutTeamInput, TeamRequestUncheckedCreateWithoutTeamInput> | TeamRequestCreateWithoutTeamInput[] | TeamRequestUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamRequestCreateOrConnectWithoutTeamInput | TeamRequestCreateOrConnectWithoutTeamInput[]
    upsert?: TeamRequestUpsertWithWhereUniqueWithoutTeamInput | TeamRequestUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamRequestCreateManyTeamInputEnvelope
    set?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    disconnect?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    delete?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    connect?: TeamRequestWhereUniqueInput | TeamRequestWhereUniqueInput[]
    update?: TeamRequestUpdateWithWhereUniqueWithoutTeamInput | TeamRequestUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamRequestUpdateManyWithWhereWithoutTeamInput | TeamRequestUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamRequestScalarWhereInput | TeamRequestScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<ProjectCreateWithoutTeamInput, ProjectUncheckedCreateWithoutTeamInput> | ProjectCreateWithoutTeamInput[] | ProjectUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutTeamInput | ProjectCreateOrConnectWithoutTeamInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutTeamInput | ProjectUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: ProjectCreateManyTeamInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutTeamInput | ProjectUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutTeamInput | ProjectUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<MessageCreateWithoutTeamInput, MessageUncheckedCreateWithoutTeamInput> | MessageCreateWithoutTeamInput[] | MessageUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutTeamInput | MessageCreateOrConnectWithoutTeamInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutTeamInput | MessageUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: MessageCreateManyTeamInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutTeamInput | MessageUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutTeamInput | MessageUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<NotificationCreateWithoutTeamInput, NotificationUncheckedCreateWithoutTeamInput> | NotificationCreateWithoutTeamInput[] | NotificationUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTeamInput | NotificationCreateOrConnectWithoutTeamInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutTeamInput | NotificationUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: NotificationCreateManyTeamInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutTeamInput | NotificationUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutTeamInput | NotificationUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type TeamCreateNestedOneWithoutMembersInput = {
    create?: XOR<TeamCreateWithoutMembersInput, TeamUncheckedCreateWithoutMembersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutMembersInput
    connect?: TeamWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTeamsInput = {
    create?: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumTeamRoleFieldUpdateOperationsInput = {
    set?: $Enums.TeamRole
  }

  export type TeamUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<TeamCreateWithoutMembersInput, TeamUncheckedCreateWithoutMembersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutMembersInput
    upsert?: TeamUpsertWithoutMembersInput
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutMembersInput, TeamUpdateWithoutMembersInput>, TeamUncheckedUpdateWithoutMembersInput>
  }

  export type UserUpdateOneRequiredWithoutTeamsNestedInput = {
    create?: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamsInput
    upsert?: UserUpsertWithoutTeamsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTeamsInput, UserUpdateWithoutTeamsInput>, UserUncheckedUpdateWithoutTeamsInput>
  }

  export type TeamCreateNestedOneWithoutBannedUsersInput = {
    create?: XOR<TeamCreateWithoutBannedUsersInput, TeamUncheckedCreateWithoutBannedUsersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutBannedUsersInput
    connect?: TeamWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTeamBansInput = {
    create?: XOR<UserCreateWithoutTeamBansInput, UserUncheckedCreateWithoutTeamBansInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamBansInput
    connect?: UserWhereUniqueInput
  }

  export type TeamUpdateOneRequiredWithoutBannedUsersNestedInput = {
    create?: XOR<TeamCreateWithoutBannedUsersInput, TeamUncheckedCreateWithoutBannedUsersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutBannedUsersInput
    upsert?: TeamUpsertWithoutBannedUsersInput
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutBannedUsersInput, TeamUpdateWithoutBannedUsersInput>, TeamUncheckedUpdateWithoutBannedUsersInput>
  }

  export type UserUpdateOneRequiredWithoutTeamBansNestedInput = {
    create?: XOR<UserCreateWithoutTeamBansInput, UserUncheckedCreateWithoutTeamBansInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamBansInput
    upsert?: UserUpsertWithoutTeamBansInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTeamBansInput, UserUpdateWithoutTeamBansInput>, UserUncheckedUpdateWithoutTeamBansInput>
  }

  export type TeamCreateNestedOneWithoutPendingRequestsInput = {
    create?: XOR<TeamCreateWithoutPendingRequestsInput, TeamUncheckedCreateWithoutPendingRequestsInput>
    connectOrCreate?: TeamCreateOrConnectWithoutPendingRequestsInput
    connect?: TeamWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTeamJoinRequestsInput = {
    create?: XOR<UserCreateWithoutTeamJoinRequestsInput, UserUncheckedCreateWithoutTeamJoinRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamJoinRequestsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.RequestStatus
  }

  export type TeamUpdateOneRequiredWithoutPendingRequestsNestedInput = {
    create?: XOR<TeamCreateWithoutPendingRequestsInput, TeamUncheckedCreateWithoutPendingRequestsInput>
    connectOrCreate?: TeamCreateOrConnectWithoutPendingRequestsInput
    upsert?: TeamUpsertWithoutPendingRequestsInput
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutPendingRequestsInput, TeamUpdateWithoutPendingRequestsInput>, TeamUncheckedUpdateWithoutPendingRequestsInput>
  }

  export type UserUpdateOneRequiredWithoutTeamJoinRequestsNestedInput = {
    create?: XOR<UserCreateWithoutTeamJoinRequestsInput, UserUncheckedCreateWithoutTeamJoinRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamJoinRequestsInput
    upsert?: UserUpsertWithoutTeamJoinRequestsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTeamJoinRequestsInput, UserUpdateWithoutTeamJoinRequestsInput>, UserUncheckedUpdateWithoutTeamJoinRequestsInput>
  }

  export type UserCreateNestedOneWithoutProjectsInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    connect?: UserWhereUniqueInput
  }

  export type TeamCreateNestedOneWithoutProjectsInput = {
    create?: XOR<TeamCreateWithoutProjectsInput, TeamUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: TeamCreateOrConnectWithoutProjectsInput
    connect?: TeamWhereUniqueInput
  }

  export type UserCreateNestedManyWithoutStarredProjectsInput = {
    create?: XOR<UserCreateWithoutStarredProjectsInput, UserUncheckedCreateWithoutStarredProjectsInput> | UserCreateWithoutStarredProjectsInput[] | UserUncheckedCreateWithoutStarredProjectsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutStarredProjectsInput | UserCreateOrConnectWithoutStarredProjectsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutArchieveProjectsInput = {
    create?: XOR<UserCreateWithoutArchieveProjectsInput, UserUncheckedCreateWithoutArchieveProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutArchieveProjectsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAppsGeneratedInput = {
    create?: XOR<UserCreateWithoutAppsGeneratedInput, UserUncheckedCreateWithoutAppsGeneratedInput>
    connectOrCreate?: UserCreateOrConnectWithoutAppsGeneratedInput
    connect?: UserWhereUniqueInput
  }

  export type FileItemCreateNestedManyWithoutProjectInput = {
    create?: XOR<FileItemCreateWithoutProjectInput, FileItemUncheckedCreateWithoutProjectInput> | FileItemCreateWithoutProjectInput[] | FileItemUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: FileItemCreateOrConnectWithoutProjectInput | FileItemCreateOrConnectWithoutProjectInput[]
    createMany?: FileItemCreateManyProjectInputEnvelope
    connect?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutStarredProjectsInput = {
    create?: XOR<UserCreateWithoutStarredProjectsInput, UserUncheckedCreateWithoutStarredProjectsInput> | UserCreateWithoutStarredProjectsInput[] | UserUncheckedCreateWithoutStarredProjectsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutStarredProjectsInput | UserCreateOrConnectWithoutStarredProjectsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type FileItemUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<FileItemCreateWithoutProjectInput, FileItemUncheckedCreateWithoutProjectInput> | FileItemCreateWithoutProjectInput[] | FileItemUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: FileItemCreateOrConnectWithoutProjectInput | FileItemCreateOrConnectWithoutProjectInput[]
    createMany?: FileItemCreateManyProjectInputEnvelope
    connect?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
  }

  export type EnumProjectTypeFieldUpdateOperationsInput = {
    set?: $Enums.ProjectType
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    upsert?: UserUpsertWithoutProjectsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProjectsInput, UserUpdateWithoutProjectsInput>, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type TeamUpdateOneWithoutProjectsNestedInput = {
    create?: XOR<TeamCreateWithoutProjectsInput, TeamUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: TeamCreateOrConnectWithoutProjectsInput
    upsert?: TeamUpsertWithoutProjectsInput
    disconnect?: TeamWhereInput | boolean
    delete?: TeamWhereInput | boolean
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutProjectsInput, TeamUpdateWithoutProjectsInput>, TeamUncheckedUpdateWithoutProjectsInput>
  }

  export type UserUpdateManyWithoutStarredProjectsNestedInput = {
    create?: XOR<UserCreateWithoutStarredProjectsInput, UserUncheckedCreateWithoutStarredProjectsInput> | UserCreateWithoutStarredProjectsInput[] | UserUncheckedCreateWithoutStarredProjectsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutStarredProjectsInput | UserCreateOrConnectWithoutStarredProjectsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutStarredProjectsInput | UserUpsertWithWhereUniqueWithoutStarredProjectsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutStarredProjectsInput | UserUpdateWithWhereUniqueWithoutStarredProjectsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutStarredProjectsInput | UserUpdateManyWithWhereWithoutStarredProjectsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUpdateOneWithoutArchieveProjectsNestedInput = {
    create?: XOR<UserCreateWithoutArchieveProjectsInput, UserUncheckedCreateWithoutArchieveProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutArchieveProjectsInput
    upsert?: UserUpsertWithoutArchieveProjectsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutArchieveProjectsInput, UserUpdateWithoutArchieveProjectsInput>, UserUncheckedUpdateWithoutArchieveProjectsInput>
  }

  export type UserUpdateOneWithoutAppsGeneratedNestedInput = {
    create?: XOR<UserCreateWithoutAppsGeneratedInput, UserUncheckedCreateWithoutAppsGeneratedInput>
    connectOrCreate?: UserCreateOrConnectWithoutAppsGeneratedInput
    upsert?: UserUpsertWithoutAppsGeneratedInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAppsGeneratedInput, UserUpdateWithoutAppsGeneratedInput>, UserUncheckedUpdateWithoutAppsGeneratedInput>
  }

  export type FileItemUpdateManyWithoutProjectNestedInput = {
    create?: XOR<FileItemCreateWithoutProjectInput, FileItemUncheckedCreateWithoutProjectInput> | FileItemCreateWithoutProjectInput[] | FileItemUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: FileItemCreateOrConnectWithoutProjectInput | FileItemCreateOrConnectWithoutProjectInput[]
    upsert?: FileItemUpsertWithWhereUniqueWithoutProjectInput | FileItemUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: FileItemCreateManyProjectInputEnvelope
    set?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    disconnect?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    delete?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    connect?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    update?: FileItemUpdateWithWhereUniqueWithoutProjectInput | FileItemUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: FileItemUpdateManyWithWhereWithoutProjectInput | FileItemUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: FileItemScalarWhereInput | FileItemScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutStarredProjectsNestedInput = {
    create?: XOR<UserCreateWithoutStarredProjectsInput, UserUncheckedCreateWithoutStarredProjectsInput> | UserCreateWithoutStarredProjectsInput[] | UserUncheckedCreateWithoutStarredProjectsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutStarredProjectsInput | UserCreateOrConnectWithoutStarredProjectsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutStarredProjectsInput | UserUpsertWithWhereUniqueWithoutStarredProjectsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutStarredProjectsInput | UserUpdateWithWhereUniqueWithoutStarredProjectsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutStarredProjectsInput | UserUpdateManyWithWhereWithoutStarredProjectsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type FileItemUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<FileItemCreateWithoutProjectInput, FileItemUncheckedCreateWithoutProjectInput> | FileItemCreateWithoutProjectInput[] | FileItemUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: FileItemCreateOrConnectWithoutProjectInput | FileItemCreateOrConnectWithoutProjectInput[]
    upsert?: FileItemUpsertWithWhereUniqueWithoutProjectInput | FileItemUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: FileItemCreateManyProjectInputEnvelope
    set?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    disconnect?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    delete?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    connect?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    update?: FileItemUpdateWithWhereUniqueWithoutProjectInput | FileItemUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: FileItemUpdateManyWithWhereWithoutProjectInput | FileItemUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: FileItemScalarWhereInput | FileItemScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutFilesInput = {
    create?: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput
    connect?: ProjectWhereUniqueInput
  }

  export type FileItemCreateNestedOneWithoutChildrenInput = {
    create?: XOR<FileItemCreateWithoutChildrenInput, FileItemUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: FileItemCreateOrConnectWithoutChildrenInput
    connect?: FileItemWhereUniqueInput
  }

  export type FileItemCreateNestedManyWithoutParentInput = {
    create?: XOR<FileItemCreateWithoutParentInput, FileItemUncheckedCreateWithoutParentInput> | FileItemCreateWithoutParentInput[] | FileItemUncheckedCreateWithoutParentInput[]
    connectOrCreate?: FileItemCreateOrConnectWithoutParentInput | FileItemCreateOrConnectWithoutParentInput[]
    createMany?: FileItemCreateManyParentInputEnvelope
    connect?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
  }

  export type FileItemUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<FileItemCreateWithoutParentInput, FileItemUncheckedCreateWithoutParentInput> | FileItemCreateWithoutParentInput[] | FileItemUncheckedCreateWithoutParentInput[]
    connectOrCreate?: FileItemCreateOrConnectWithoutParentInput | FileItemCreateOrConnectWithoutParentInput[]
    createMany?: FileItemCreateManyParentInputEnvelope
    connect?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
  }

  export type ProjectUpdateOneRequiredWithoutFilesNestedInput = {
    create?: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput
    upsert?: ProjectUpsertWithoutFilesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutFilesInput, ProjectUpdateWithoutFilesInput>, ProjectUncheckedUpdateWithoutFilesInput>
  }

  export type FileItemUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<FileItemCreateWithoutChildrenInput, FileItemUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: FileItemCreateOrConnectWithoutChildrenInput
    upsert?: FileItemUpsertWithoutChildrenInput
    disconnect?: FileItemWhereInput | boolean
    delete?: FileItemWhereInput | boolean
    connect?: FileItemWhereUniqueInput
    update?: XOR<XOR<FileItemUpdateToOneWithWhereWithoutChildrenInput, FileItemUpdateWithoutChildrenInput>, FileItemUncheckedUpdateWithoutChildrenInput>
  }

  export type FileItemUpdateManyWithoutParentNestedInput = {
    create?: XOR<FileItemCreateWithoutParentInput, FileItemUncheckedCreateWithoutParentInput> | FileItemCreateWithoutParentInput[] | FileItemUncheckedCreateWithoutParentInput[]
    connectOrCreate?: FileItemCreateOrConnectWithoutParentInput | FileItemCreateOrConnectWithoutParentInput[]
    upsert?: FileItemUpsertWithWhereUniqueWithoutParentInput | FileItemUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: FileItemCreateManyParentInputEnvelope
    set?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    disconnect?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    delete?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    connect?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    update?: FileItemUpdateWithWhereUniqueWithoutParentInput | FileItemUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: FileItemUpdateManyWithWhereWithoutParentInput | FileItemUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: FileItemScalarWhereInput | FileItemScalarWhereInput[]
  }

  export type FileItemUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<FileItemCreateWithoutParentInput, FileItemUncheckedCreateWithoutParentInput> | FileItemCreateWithoutParentInput[] | FileItemUncheckedCreateWithoutParentInput[]
    connectOrCreate?: FileItemCreateOrConnectWithoutParentInput | FileItemCreateOrConnectWithoutParentInput[]
    upsert?: FileItemUpsertWithWhereUniqueWithoutParentInput | FileItemUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: FileItemCreateManyParentInputEnvelope
    set?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    disconnect?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    delete?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    connect?: FileItemWhereUniqueInput | FileItemWhereUniqueInput[]
    update?: FileItemUpdateWithWhereUniqueWithoutParentInput | FileItemUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: FileItemUpdateManyWithWhereWithoutParentInput | FileItemUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: FileItemScalarWhereInput | FileItemScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSentMessagesInput = {
    create?: XOR<UserCreateWithoutSentMessagesInput, UserUncheckedCreateWithoutSentMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentMessagesInput
    connect?: UserWhereUniqueInput
  }

  export type FriendshipCreateNestedOneWithoutMessagesInput = {
    create?: XOR<FriendshipCreateWithoutMessagesInput, FriendshipUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: FriendshipCreateOrConnectWithoutMessagesInput
    connect?: FriendshipWhereUniqueInput
  }

  export type TeamCreateNestedOneWithoutMessagesInput = {
    create?: XOR<TeamCreateWithoutMessagesInput, TeamUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: TeamCreateOrConnectWithoutMessagesInput
    connect?: TeamWhereUniqueInput
  }

  export type NotificationCreateNestedManyWithoutMessageInput = {
    create?: XOR<NotificationCreateWithoutMessageInput, NotificationUncheckedCreateWithoutMessageInput> | NotificationCreateWithoutMessageInput[] | NotificationUncheckedCreateWithoutMessageInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutMessageInput | NotificationCreateOrConnectWithoutMessageInput[]
    createMany?: NotificationCreateManyMessageInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutDeletedMessagesInput = {
    create?: XOR<UserCreateWithoutDeletedMessagesInput, UserUncheckedCreateWithoutDeletedMessagesInput> | UserCreateWithoutDeletedMessagesInput[] | UserUncheckedCreateWithoutDeletedMessagesInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDeletedMessagesInput | UserCreateOrConnectWithoutDeletedMessagesInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutMessageInput = {
    create?: XOR<NotificationCreateWithoutMessageInput, NotificationUncheckedCreateWithoutMessageInput> | NotificationCreateWithoutMessageInput[] | NotificationUncheckedCreateWithoutMessageInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutMessageInput | NotificationCreateOrConnectWithoutMessageInput[]
    createMany?: NotificationCreateManyMessageInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutDeletedMessagesInput = {
    create?: XOR<UserCreateWithoutDeletedMessagesInput, UserUncheckedCreateWithoutDeletedMessagesInput> | UserCreateWithoutDeletedMessagesInput[] | UserUncheckedCreateWithoutDeletedMessagesInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDeletedMessagesInput | UserCreateOrConnectWithoutDeletedMessagesInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutSentMessagesNestedInput = {
    create?: XOR<UserCreateWithoutSentMessagesInput, UserUncheckedCreateWithoutSentMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentMessagesInput
    upsert?: UserUpsertWithoutSentMessagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSentMessagesInput, UserUpdateWithoutSentMessagesInput>, UserUncheckedUpdateWithoutSentMessagesInput>
  }

  export type FriendshipUpdateOneWithoutMessagesNestedInput = {
    create?: XOR<FriendshipCreateWithoutMessagesInput, FriendshipUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: FriendshipCreateOrConnectWithoutMessagesInput
    upsert?: FriendshipUpsertWithoutMessagesInput
    disconnect?: FriendshipWhereInput | boolean
    delete?: FriendshipWhereInput | boolean
    connect?: FriendshipWhereUniqueInput
    update?: XOR<XOR<FriendshipUpdateToOneWithWhereWithoutMessagesInput, FriendshipUpdateWithoutMessagesInput>, FriendshipUncheckedUpdateWithoutMessagesInput>
  }

  export type TeamUpdateOneWithoutMessagesNestedInput = {
    create?: XOR<TeamCreateWithoutMessagesInput, TeamUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: TeamCreateOrConnectWithoutMessagesInput
    upsert?: TeamUpsertWithoutMessagesInput
    disconnect?: TeamWhereInput | boolean
    delete?: TeamWhereInput | boolean
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutMessagesInput, TeamUpdateWithoutMessagesInput>, TeamUncheckedUpdateWithoutMessagesInput>
  }

  export type NotificationUpdateManyWithoutMessageNestedInput = {
    create?: XOR<NotificationCreateWithoutMessageInput, NotificationUncheckedCreateWithoutMessageInput> | NotificationCreateWithoutMessageInput[] | NotificationUncheckedCreateWithoutMessageInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutMessageInput | NotificationCreateOrConnectWithoutMessageInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutMessageInput | NotificationUpsertWithWhereUniqueWithoutMessageInput[]
    createMany?: NotificationCreateManyMessageInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutMessageInput | NotificationUpdateWithWhereUniqueWithoutMessageInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutMessageInput | NotificationUpdateManyWithWhereWithoutMessageInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserUpdateManyWithoutDeletedMessagesNestedInput = {
    create?: XOR<UserCreateWithoutDeletedMessagesInput, UserUncheckedCreateWithoutDeletedMessagesInput> | UserCreateWithoutDeletedMessagesInput[] | UserUncheckedCreateWithoutDeletedMessagesInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDeletedMessagesInput | UserCreateOrConnectWithoutDeletedMessagesInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutDeletedMessagesInput | UserUpsertWithWhereUniqueWithoutDeletedMessagesInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutDeletedMessagesInput | UserUpdateWithWhereUniqueWithoutDeletedMessagesInput[]
    updateMany?: UserUpdateManyWithWhereWithoutDeletedMessagesInput | UserUpdateManyWithWhereWithoutDeletedMessagesInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutMessageNestedInput = {
    create?: XOR<NotificationCreateWithoutMessageInput, NotificationUncheckedCreateWithoutMessageInput> | NotificationCreateWithoutMessageInput[] | NotificationUncheckedCreateWithoutMessageInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutMessageInput | NotificationCreateOrConnectWithoutMessageInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutMessageInput | NotificationUpsertWithWhereUniqueWithoutMessageInput[]
    createMany?: NotificationCreateManyMessageInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutMessageInput | NotificationUpdateWithWhereUniqueWithoutMessageInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutMessageInput | NotificationUpdateManyWithWhereWithoutMessageInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutDeletedMessagesNestedInput = {
    create?: XOR<UserCreateWithoutDeletedMessagesInput, UserUncheckedCreateWithoutDeletedMessagesInput> | UserCreateWithoutDeletedMessagesInput[] | UserUncheckedCreateWithoutDeletedMessagesInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDeletedMessagesInput | UserCreateOrConnectWithoutDeletedMessagesInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutDeletedMessagesInput | UserUpsertWithWhereUniqueWithoutDeletedMessagesInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutDeletedMessagesInput | UserUpdateWithWhereUniqueWithoutDeletedMessagesInput[]
    updateMany?: UserUpdateManyWithWhereWithoutDeletedMessagesInput | UserUpdateManyWithWhereWithoutDeletedMessagesInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSentNotificationsInput = {
    create?: XOR<UserCreateWithoutSentNotificationsInput, UserUncheckedCreateWithoutSentNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReceivedNotificationsInput = {
    create?: XOR<UserCreateWithoutReceivedNotificationsInput, UserUncheckedCreateWithoutReceivedNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type MessageCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<MessageCreateWithoutNotificationsInput, MessageUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: MessageCreateOrConnectWithoutNotificationsInput
    connect?: MessageWhereUniqueInput
  }

  export type TeamCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<TeamCreateWithoutNotificationsInput, TeamUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: TeamCreateOrConnectWithoutNotificationsInput
    connect?: TeamWhereUniqueInput
  }

  export type EnumNotificationTypeFieldUpdateOperationsInput = {
    set?: $Enums.NotificationType
  }

  export type UserUpdateOneRequiredWithoutSentNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutSentNotificationsInput, UserUncheckedCreateWithoutSentNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentNotificationsInput
    upsert?: UserUpsertWithoutSentNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSentNotificationsInput, UserUpdateWithoutSentNotificationsInput>, UserUncheckedUpdateWithoutSentNotificationsInput>
  }

  export type UserUpdateOneRequiredWithoutReceivedNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutReceivedNotificationsInput, UserUncheckedCreateWithoutReceivedNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedNotificationsInput
    upsert?: UserUpsertWithoutReceivedNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReceivedNotificationsInput, UserUpdateWithoutReceivedNotificationsInput>, UserUncheckedUpdateWithoutReceivedNotificationsInput>
  }

  export type MessageUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<MessageCreateWithoutNotificationsInput, MessageUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: MessageCreateOrConnectWithoutNotificationsInput
    upsert?: MessageUpsertWithoutNotificationsInput
    disconnect?: MessageWhereInput | boolean
    delete?: MessageWhereInput | boolean
    connect?: MessageWhereUniqueInput
    update?: XOR<XOR<MessageUpdateToOneWithWhereWithoutNotificationsInput, MessageUpdateWithoutNotificationsInput>, MessageUncheckedUpdateWithoutNotificationsInput>
  }

  export type TeamUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<TeamCreateWithoutNotificationsInput, TeamUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: TeamCreateOrConnectWithoutNotificationsInput
    upsert?: TeamUpsertWithoutNotificationsInput
    disconnect?: TeamWhereInput | boolean
    delete?: TeamWhereInput | boolean
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutNotificationsInput, TeamUpdateWithoutNotificationsInput>, TeamUncheckedUpdateWithoutNotificationsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumFriendshipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusFilter<$PrismaModel> | $Enums.FriendshipStatus
  }

  export type NestedEnumFriendshipStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusWithAggregatesFilter<$PrismaModel> | $Enums.FriendshipStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFriendshipStatusFilter<$PrismaModel>
    _max?: NestedEnumFriendshipStatusFilter<$PrismaModel>
  }

  export type NestedEnumTeamTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamType | EnumTeamTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TeamType[] | ListEnumTeamTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamType[] | ListEnumTeamTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamTypeFilter<$PrismaModel> | $Enums.TeamType
  }

  export type NestedEnumTeamTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamType | EnumTeamTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TeamType[] | ListEnumTeamTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamType[] | ListEnumTeamTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamTypeWithAggregatesFilter<$PrismaModel> | $Enums.TeamType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTeamTypeFilter<$PrismaModel>
    _max?: NestedEnumTeamTypeFilter<$PrismaModel>
  }

  export type NestedEnumTeamRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamRole | EnumTeamRoleFieldRefInput<$PrismaModel>
    in?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamRoleFilter<$PrismaModel> | $Enums.TeamRole
  }

  export type NestedEnumTeamRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamRole | EnumTeamRoleFieldRefInput<$PrismaModel>
    in?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamRoleWithAggregatesFilter<$PrismaModel> | $Enums.TeamRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTeamRoleFilter<$PrismaModel>
    _max?: NestedEnumTeamRoleFilter<$PrismaModel>
  }

  export type NestedEnumRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusFilter<$PrismaModel> | $Enums.RequestStatus
  }

  export type NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.RequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumRequestStatusFilter<$PrismaModel>
  }

  export type NestedEnumProjectTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectType | EnumProjectTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectType[] | ListEnumProjectTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectType[] | ListEnumProjectTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectTypeFilter<$PrismaModel> | $Enums.ProjectType
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumProjectTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectType | EnumProjectTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectType[] | ListEnumProjectTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectType[] | ListEnumProjectTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectTypeWithAggregatesFilter<$PrismaModel> | $Enums.ProjectType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectTypeFilter<$PrismaModel>
    _max?: NestedEnumProjectTypeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type ProjectCreateWithoutArchiveprojectByInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    owner: UserCreateNestedOneWithoutProjectsInput
    team?: TeamCreateNestedOneWithoutProjectsInput
    starredBy?: UserCreateNestedManyWithoutStarredProjectsInput
    genratedProjectsby?: UserCreateNestedOneWithoutAppsGeneratedInput
    files?: FileItemCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutArchiveprojectByInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    ownerId: string
    teamId?: string | null
    generatedById?: string | null
    createdAt?: Date | string
    starredBy?: UserUncheckedCreateNestedManyWithoutStarredProjectsInput
    files?: FileItemUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutArchiveprojectByInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutArchiveprojectByInput, ProjectUncheckedCreateWithoutArchiveprojectByInput>
  }

  export type ProjectCreateManyArchiveprojectByInputEnvelope = {
    data: ProjectCreateManyArchiveprojectByInput | ProjectCreateManyArchiveprojectByInput[]
    skipDuplicates?: boolean
  }

  export type ProjectCreateWithoutGenratedProjectsbyInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    owner: UserCreateNestedOneWithoutProjectsInput
    team?: TeamCreateNestedOneWithoutProjectsInput
    starredBy?: UserCreateNestedManyWithoutStarredProjectsInput
    archiveprojectBy?: UserCreateNestedOneWithoutArchieveProjectsInput
    files?: FileItemCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutGenratedProjectsbyInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    ownerId: string
    teamId?: string | null
    archeivedBy?: string | null
    createdAt?: Date | string
    starredBy?: UserUncheckedCreateNestedManyWithoutStarredProjectsInput
    files?: FileItemUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutGenratedProjectsbyInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutGenratedProjectsbyInput, ProjectUncheckedCreateWithoutGenratedProjectsbyInput>
  }

  export type ProjectCreateManyGenratedProjectsbyInputEnvelope = {
    data: ProjectCreateManyGenratedProjectsbyInput | ProjectCreateManyGenratedProjectsbyInput[]
    skipDuplicates?: boolean
  }

  export type ProjectCreateWithoutStarredByInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    owner: UserCreateNestedOneWithoutProjectsInput
    team?: TeamCreateNestedOneWithoutProjectsInput
    archiveprojectBy?: UserCreateNestedOneWithoutArchieveProjectsInput
    genratedProjectsby?: UserCreateNestedOneWithoutAppsGeneratedInput
    files?: FileItemCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutStarredByInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    ownerId: string
    teamId?: string | null
    generatedById?: string | null
    archeivedBy?: string | null
    createdAt?: Date | string
    files?: FileItemUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutStarredByInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutStarredByInput, ProjectUncheckedCreateWithoutStarredByInput>
  }

  export type ProjectCreateWithoutOwnerInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    team?: TeamCreateNestedOneWithoutProjectsInput
    starredBy?: UserCreateNestedManyWithoutStarredProjectsInput
    archiveprojectBy?: UserCreateNestedOneWithoutArchieveProjectsInput
    genratedProjectsby?: UserCreateNestedOneWithoutAppsGeneratedInput
    files?: FileItemCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutOwnerInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    teamId?: string | null
    generatedById?: string | null
    archeivedBy?: string | null
    createdAt?: Date | string
    starredBy?: UserUncheckedCreateNestedManyWithoutStarredProjectsInput
    files?: FileItemUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutOwnerInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput>
  }

  export type ProjectCreateManyOwnerInputEnvelope = {
    data: ProjectCreateManyOwnerInput | ProjectCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type TeamMemberCreateWithoutUserInput = {
    id?: string
    role: $Enums.TeamRole
    joinedAt?: Date | string
    team: TeamCreateNestedOneWithoutMembersInput
  }

  export type TeamMemberUncheckedCreateWithoutUserInput = {
    id?: string
    teamId: string
    role: $Enums.TeamRole
    joinedAt?: Date | string
  }

  export type TeamMemberCreateOrConnectWithoutUserInput = {
    where: TeamMemberWhereUniqueInput
    create: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput>
  }

  export type TeamMemberCreateManyUserInputEnvelope = {
    data: TeamMemberCreateManyUserInput | TeamMemberCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TeamRequestCreateWithoutUserInput = {
    id?: string
    requestedAt?: Date | string
    status: $Enums.RequestStatus
    team: TeamCreateNestedOneWithoutPendingRequestsInput
  }

  export type TeamRequestUncheckedCreateWithoutUserInput = {
    id?: string
    teamId: string
    requestedAt?: Date | string
    status: $Enums.RequestStatus
  }

  export type TeamRequestCreateOrConnectWithoutUserInput = {
    where: TeamRequestWhereUniqueInput
    create: XOR<TeamRequestCreateWithoutUserInput, TeamRequestUncheckedCreateWithoutUserInput>
  }

  export type TeamRequestCreateManyUserInputEnvelope = {
    data: TeamRequestCreateManyUserInput | TeamRequestCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TeamBanCreateWithoutUserInput = {
    id?: string
    bannedAt?: Date | string
    reason?: string | null
    team: TeamCreateNestedOneWithoutBannedUsersInput
  }

  export type TeamBanUncheckedCreateWithoutUserInput = {
    id?: string
    teamId: string
    bannedAt?: Date | string
    reason?: string | null
  }

  export type TeamBanCreateOrConnectWithoutUserInput = {
    where: TeamBanWhereUniqueInput
    create: XOR<TeamBanCreateWithoutUserInput, TeamBanUncheckedCreateWithoutUserInput>
  }

  export type TeamBanCreateManyUserInputEnvelope = {
    data: TeamBanCreateManyUserInput | TeamBanCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutSenderInput = {
    id?: string
    content: string
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    dmChatRoom?: FriendshipCreateNestedOneWithoutMessagesInput
    team?: TeamCreateNestedOneWithoutMessagesInput
    notifications?: NotificationCreateNestedManyWithoutMessageInput
    isDeletedBy?: UserCreateNestedManyWithoutDeletedMessagesInput
  }

  export type MessageUncheckedCreateWithoutSenderInput = {
    id?: string
    content: string
    dmChatRoomId?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutMessageInput
    isDeletedBy?: UserUncheckedCreateNestedManyWithoutDeletedMessagesInput
  }

  export type MessageCreateOrConnectWithoutSenderInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageCreateManySenderInputEnvelope = {
    data: MessageCreateManySenderInput | MessageCreateManySenderInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutSenderInput = {
    id?: string
    type?: $Enums.NotificationType
    content?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    receiver: UserCreateNestedOneWithoutReceivedNotificationsInput
    message?: MessageCreateNestedOneWithoutNotificationsInput
    team?: TeamCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutSenderInput = {
    id?: string
    receiverId: string
    type?: $Enums.NotificationType
    content?: string | null
    messageId?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutSenderInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutSenderInput, NotificationUncheckedCreateWithoutSenderInput>
  }

  export type NotificationCreateManySenderInputEnvelope = {
    data: NotificationCreateManySenderInput | NotificationCreateManySenderInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutReceiverInput = {
    id?: string
    type?: $Enums.NotificationType
    content?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutSentNotificationsInput
    message?: MessageCreateNestedOneWithoutNotificationsInput
    team?: TeamCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutReceiverInput = {
    id?: string
    senderId: string
    type?: $Enums.NotificationType
    content?: string | null
    messageId?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutReceiverInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutReceiverInput, NotificationUncheckedCreateWithoutReceiverInput>
  }

  export type NotificationCreateManyReceiverInputEnvelope = {
    data: NotificationCreateManyReceiverInput | NotificationCreateManyReceiverInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutIsDeletedByInput = {
    id?: string
    content: string
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutSentMessagesInput
    dmChatRoom?: FriendshipCreateNestedOneWithoutMessagesInput
    team?: TeamCreateNestedOneWithoutMessagesInput
    notifications?: NotificationCreateNestedManyWithoutMessageInput
  }

  export type MessageUncheckedCreateWithoutIsDeletedByInput = {
    id?: string
    content: string
    senderId: string
    dmChatRoomId?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutMessageInput
  }

  export type MessageCreateOrConnectWithoutIsDeletedByInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutIsDeletedByInput, MessageUncheckedCreateWithoutIsDeletedByInput>
  }

  export type FriendshipCreateWithoutInitiatorInput = {
    id?: string
    status: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    receiver: UserCreateNestedOneWithoutFriendshipsReceivedInput
    messages?: MessageCreateNestedManyWithoutDmChatRoomInput
  }

  export type FriendshipUncheckedCreateWithoutInitiatorInput = {
    id?: string
    receiverId: string
    status: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutDmChatRoomInput
  }

  export type FriendshipCreateOrConnectWithoutInitiatorInput = {
    where: FriendshipWhereUniqueInput
    create: XOR<FriendshipCreateWithoutInitiatorInput, FriendshipUncheckedCreateWithoutInitiatorInput>
  }

  export type FriendshipCreateManyInitiatorInputEnvelope = {
    data: FriendshipCreateManyInitiatorInput | FriendshipCreateManyInitiatorInput[]
    skipDuplicates?: boolean
  }

  export type FriendshipCreateWithoutReceiverInput = {
    id?: string
    status: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    initiator: UserCreateNestedOneWithoutFriendshipsInitiatedInput
    messages?: MessageCreateNestedManyWithoutDmChatRoomInput
  }

  export type FriendshipUncheckedCreateWithoutReceiverInput = {
    id?: string
    initiatorId: string
    status: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutDmChatRoomInput
  }

  export type FriendshipCreateOrConnectWithoutReceiverInput = {
    where: FriendshipWhereUniqueInput
    create: XOR<FriendshipCreateWithoutReceiverInput, FriendshipUncheckedCreateWithoutReceiverInput>
  }

  export type FriendshipCreateManyReceiverInputEnvelope = {
    data: FriendshipCreateManyReceiverInput | FriendshipCreateManyReceiverInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithWhereUniqueWithoutArchiveprojectByInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutArchiveprojectByInput, ProjectUncheckedUpdateWithoutArchiveprojectByInput>
    create: XOR<ProjectCreateWithoutArchiveprojectByInput, ProjectUncheckedCreateWithoutArchiveprojectByInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutArchiveprojectByInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutArchiveprojectByInput, ProjectUncheckedUpdateWithoutArchiveprojectByInput>
  }

  export type ProjectUpdateManyWithWhereWithoutArchiveprojectByInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutArchiveprojectByInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    packages?: StringFilter<"Project"> | string
    type?: EnumProjectTypeFilter<"Project"> | $Enums.ProjectType
    isGitImport?: BoolFilter<"Project"> | boolean
    gitKey?: StringNullableFilter<"Project"> | string | null
    gitRepo?: StringNullableFilter<"Project"> | string | null
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    ownerId?: StringFilter<"Project"> | string
    teamId?: StringNullableFilter<"Project"> | string | null
    generatedById?: StringNullableFilter<"Project"> | string | null
    archeivedBy?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
  }

  export type ProjectUpsertWithWhereUniqueWithoutGenratedProjectsbyInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutGenratedProjectsbyInput, ProjectUncheckedUpdateWithoutGenratedProjectsbyInput>
    create: XOR<ProjectCreateWithoutGenratedProjectsbyInput, ProjectUncheckedCreateWithoutGenratedProjectsbyInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutGenratedProjectsbyInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutGenratedProjectsbyInput, ProjectUncheckedUpdateWithoutGenratedProjectsbyInput>
  }

  export type ProjectUpdateManyWithWhereWithoutGenratedProjectsbyInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutGenratedProjectsbyInput>
  }

  export type ProjectUpsertWithWhereUniqueWithoutStarredByInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutStarredByInput, ProjectUncheckedUpdateWithoutStarredByInput>
    create: XOR<ProjectCreateWithoutStarredByInput, ProjectUncheckedCreateWithoutStarredByInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutStarredByInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutStarredByInput, ProjectUncheckedUpdateWithoutStarredByInput>
  }

  export type ProjectUpdateManyWithWhereWithoutStarredByInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutStarredByInput>
  }

  export type ProjectUpsertWithWhereUniqueWithoutOwnerInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutOwnerInput, ProjectUncheckedUpdateWithoutOwnerInput>
    create: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutOwnerInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutOwnerInput, ProjectUncheckedUpdateWithoutOwnerInput>
  }

  export type ProjectUpdateManyWithWhereWithoutOwnerInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutOwnerInput>
  }

  export type TeamMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: TeamMemberWhereUniqueInput
    update: XOR<TeamMemberUpdateWithoutUserInput, TeamMemberUncheckedUpdateWithoutUserInput>
    create: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput>
  }

  export type TeamMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: TeamMemberWhereUniqueInput
    data: XOR<TeamMemberUpdateWithoutUserInput, TeamMemberUncheckedUpdateWithoutUserInput>
  }

  export type TeamMemberUpdateManyWithWhereWithoutUserInput = {
    where: TeamMemberScalarWhereInput
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type TeamMemberScalarWhereInput = {
    AND?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
    OR?: TeamMemberScalarWhereInput[]
    NOT?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
    id?: StringFilter<"TeamMember"> | string
    teamId?: StringFilter<"TeamMember"> | string
    userId?: StringFilter<"TeamMember"> | string
    role?: EnumTeamRoleFilter<"TeamMember"> | $Enums.TeamRole
    joinedAt?: DateTimeFilter<"TeamMember"> | Date | string
  }

  export type TeamRequestUpsertWithWhereUniqueWithoutUserInput = {
    where: TeamRequestWhereUniqueInput
    update: XOR<TeamRequestUpdateWithoutUserInput, TeamRequestUncheckedUpdateWithoutUserInput>
    create: XOR<TeamRequestCreateWithoutUserInput, TeamRequestUncheckedCreateWithoutUserInput>
  }

  export type TeamRequestUpdateWithWhereUniqueWithoutUserInput = {
    where: TeamRequestWhereUniqueInput
    data: XOR<TeamRequestUpdateWithoutUserInput, TeamRequestUncheckedUpdateWithoutUserInput>
  }

  export type TeamRequestUpdateManyWithWhereWithoutUserInput = {
    where: TeamRequestScalarWhereInput
    data: XOR<TeamRequestUpdateManyMutationInput, TeamRequestUncheckedUpdateManyWithoutUserInput>
  }

  export type TeamRequestScalarWhereInput = {
    AND?: TeamRequestScalarWhereInput | TeamRequestScalarWhereInput[]
    OR?: TeamRequestScalarWhereInput[]
    NOT?: TeamRequestScalarWhereInput | TeamRequestScalarWhereInput[]
    id?: StringFilter<"TeamRequest"> | string
    teamId?: StringFilter<"TeamRequest"> | string
    userId?: StringFilter<"TeamRequest"> | string
    requestedAt?: DateTimeFilter<"TeamRequest"> | Date | string
    status?: EnumRequestStatusFilter<"TeamRequest"> | $Enums.RequestStatus
  }

  export type TeamBanUpsertWithWhereUniqueWithoutUserInput = {
    where: TeamBanWhereUniqueInput
    update: XOR<TeamBanUpdateWithoutUserInput, TeamBanUncheckedUpdateWithoutUserInput>
    create: XOR<TeamBanCreateWithoutUserInput, TeamBanUncheckedCreateWithoutUserInput>
  }

  export type TeamBanUpdateWithWhereUniqueWithoutUserInput = {
    where: TeamBanWhereUniqueInput
    data: XOR<TeamBanUpdateWithoutUserInput, TeamBanUncheckedUpdateWithoutUserInput>
  }

  export type TeamBanUpdateManyWithWhereWithoutUserInput = {
    where: TeamBanScalarWhereInput
    data: XOR<TeamBanUpdateManyMutationInput, TeamBanUncheckedUpdateManyWithoutUserInput>
  }

  export type TeamBanScalarWhereInput = {
    AND?: TeamBanScalarWhereInput | TeamBanScalarWhereInput[]
    OR?: TeamBanScalarWhereInput[]
    NOT?: TeamBanScalarWhereInput | TeamBanScalarWhereInput[]
    id?: StringFilter<"TeamBan"> | string
    teamId?: StringFilter<"TeamBan"> | string
    userId?: StringFilter<"TeamBan"> | string
    bannedAt?: DateTimeFilter<"TeamBan"> | Date | string
    reason?: StringNullableFilter<"TeamBan"> | string | null
  }

  export type MessageUpsertWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
  }

  export type MessageUpdateManyWithWhereWithoutSenderInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutSenderInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    senderId?: StringFilter<"Message"> | string
    dmChatRoomId?: StringNullableFilter<"Message"> | string | null
    teamId?: StringNullableFilter<"Message"> | string | null
    isRead?: BoolFilter<"Message"> | boolean
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutSenderInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutSenderInput, NotificationUncheckedUpdateWithoutSenderInput>
    create: XOR<NotificationCreateWithoutSenderInput, NotificationUncheckedCreateWithoutSenderInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutSenderInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutSenderInput, NotificationUncheckedUpdateWithoutSenderInput>
  }

  export type NotificationUpdateManyWithWhereWithoutSenderInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutSenderInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    senderId?: StringFilter<"Notification"> | string
    receiverId?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    content?: StringNullableFilter<"Notification"> | string | null
    messageId?: StringNullableFilter<"Notification"> | string | null
    teamId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    updatedAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutReceiverInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutReceiverInput, NotificationUncheckedUpdateWithoutReceiverInput>
    create: XOR<NotificationCreateWithoutReceiverInput, NotificationUncheckedCreateWithoutReceiverInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutReceiverInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutReceiverInput, NotificationUncheckedUpdateWithoutReceiverInput>
  }

  export type NotificationUpdateManyWithWhereWithoutReceiverInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutReceiverInput>
  }

  export type MessageUpsertWithWhereUniqueWithoutIsDeletedByInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutIsDeletedByInput, MessageUncheckedUpdateWithoutIsDeletedByInput>
    create: XOR<MessageCreateWithoutIsDeletedByInput, MessageUncheckedCreateWithoutIsDeletedByInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutIsDeletedByInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutIsDeletedByInput, MessageUncheckedUpdateWithoutIsDeletedByInput>
  }

  export type MessageUpdateManyWithWhereWithoutIsDeletedByInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutIsDeletedByInput>
  }

  export type FriendshipUpsertWithWhereUniqueWithoutInitiatorInput = {
    where: FriendshipWhereUniqueInput
    update: XOR<FriendshipUpdateWithoutInitiatorInput, FriendshipUncheckedUpdateWithoutInitiatorInput>
    create: XOR<FriendshipCreateWithoutInitiatorInput, FriendshipUncheckedCreateWithoutInitiatorInput>
  }

  export type FriendshipUpdateWithWhereUniqueWithoutInitiatorInput = {
    where: FriendshipWhereUniqueInput
    data: XOR<FriendshipUpdateWithoutInitiatorInput, FriendshipUncheckedUpdateWithoutInitiatorInput>
  }

  export type FriendshipUpdateManyWithWhereWithoutInitiatorInput = {
    where: FriendshipScalarWhereInput
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyWithoutInitiatorInput>
  }

  export type FriendshipScalarWhereInput = {
    AND?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
    OR?: FriendshipScalarWhereInput[]
    NOT?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
    id?: StringFilter<"Friendship"> | string
    initiatorId?: StringFilter<"Friendship"> | string
    receiverId?: StringFilter<"Friendship"> | string
    status?: EnumFriendshipStatusFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeFilter<"Friendship"> | Date | string
  }

  export type FriendshipUpsertWithWhereUniqueWithoutReceiverInput = {
    where: FriendshipWhereUniqueInput
    update: XOR<FriendshipUpdateWithoutReceiverInput, FriendshipUncheckedUpdateWithoutReceiverInput>
    create: XOR<FriendshipCreateWithoutReceiverInput, FriendshipUncheckedCreateWithoutReceiverInput>
  }

  export type FriendshipUpdateWithWhereUniqueWithoutReceiverInput = {
    where: FriendshipWhereUniqueInput
    data: XOR<FriendshipUpdateWithoutReceiverInput, FriendshipUncheckedUpdateWithoutReceiverInput>
  }

  export type FriendshipUpdateManyWithWhereWithoutReceiverInput = {
    where: FriendshipScalarWhereInput
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyWithoutReceiverInput>
  }

  export type UserCreateWithoutFriendshipsInitiatedInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectCreateNestedManyWithoutStarredByInput
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestCreateNestedManyWithoutUserInput
    teamBans?: TeamBanCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageCreateNestedManyWithoutIsDeletedByInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutFriendshipsInitiatedInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectUncheckedCreateNestedManyWithoutStarredByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestUncheckedCreateNestedManyWithoutUserInput
    teamBans?: TeamBanUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationUncheckedCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageUncheckedCreateNestedManyWithoutIsDeletedByInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutFriendshipsInitiatedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFriendshipsInitiatedInput, UserUncheckedCreateWithoutFriendshipsInitiatedInput>
  }

  export type UserCreateWithoutFriendshipsReceivedInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectCreateNestedManyWithoutStarredByInput
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestCreateNestedManyWithoutUserInput
    teamBans?: TeamBanCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipCreateNestedManyWithoutInitiatorInput
  }

  export type UserUncheckedCreateWithoutFriendshipsReceivedInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectUncheckedCreateNestedManyWithoutStarredByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestUncheckedCreateNestedManyWithoutUserInput
    teamBans?: TeamBanUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationUncheckedCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageUncheckedCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipUncheckedCreateNestedManyWithoutInitiatorInput
  }

  export type UserCreateOrConnectWithoutFriendshipsReceivedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFriendshipsReceivedInput, UserUncheckedCreateWithoutFriendshipsReceivedInput>
  }

  export type MessageCreateWithoutDmChatRoomInput = {
    id?: string
    content: string
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutSentMessagesInput
    team?: TeamCreateNestedOneWithoutMessagesInput
    notifications?: NotificationCreateNestedManyWithoutMessageInput
    isDeletedBy?: UserCreateNestedManyWithoutDeletedMessagesInput
  }

  export type MessageUncheckedCreateWithoutDmChatRoomInput = {
    id?: string
    content: string
    senderId: string
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutMessageInput
    isDeletedBy?: UserUncheckedCreateNestedManyWithoutDeletedMessagesInput
  }

  export type MessageCreateOrConnectWithoutDmChatRoomInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutDmChatRoomInput, MessageUncheckedCreateWithoutDmChatRoomInput>
  }

  export type MessageCreateManyDmChatRoomInputEnvelope = {
    data: MessageCreateManyDmChatRoomInput | MessageCreateManyDmChatRoomInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutFriendshipsInitiatedInput = {
    update: XOR<UserUpdateWithoutFriendshipsInitiatedInput, UserUncheckedUpdateWithoutFriendshipsInitiatedInput>
    create: XOR<UserCreateWithoutFriendshipsInitiatedInput, UserUncheckedCreateWithoutFriendshipsInitiatedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFriendshipsInitiatedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFriendshipsInitiatedInput, UserUncheckedUpdateWithoutFriendshipsInitiatedInput>
  }

  export type UserUpdateWithoutFriendshipsInitiatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUpdateManyWithoutIsDeletedByNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutFriendshipsInitiatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUncheckedUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUncheckedUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUncheckedUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUpsertWithoutFriendshipsReceivedInput = {
    update: XOR<UserUpdateWithoutFriendshipsReceivedInput, UserUncheckedUpdateWithoutFriendshipsReceivedInput>
    create: XOR<UserCreateWithoutFriendshipsReceivedInput, UserUncheckedCreateWithoutFriendshipsReceivedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFriendshipsReceivedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFriendshipsReceivedInput, UserUncheckedUpdateWithoutFriendshipsReceivedInput>
  }

  export type UserUpdateWithoutFriendshipsReceivedInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUpdateManyWithoutInitiatorNestedInput
  }

  export type UserUncheckedUpdateWithoutFriendshipsReceivedInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUncheckedUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUncheckedUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUncheckedUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput
  }

  export type MessageUpsertWithWhereUniqueWithoutDmChatRoomInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutDmChatRoomInput, MessageUncheckedUpdateWithoutDmChatRoomInput>
    create: XOR<MessageCreateWithoutDmChatRoomInput, MessageUncheckedCreateWithoutDmChatRoomInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutDmChatRoomInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutDmChatRoomInput, MessageUncheckedUpdateWithoutDmChatRoomInput>
  }

  export type MessageUpdateManyWithWhereWithoutDmChatRoomInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutDmChatRoomInput>
  }

  export type TeamMemberCreateWithoutTeamInput = {
    id?: string
    role: $Enums.TeamRole
    joinedAt?: Date | string
    user: UserCreateNestedOneWithoutTeamsInput
  }

  export type TeamMemberUncheckedCreateWithoutTeamInput = {
    id?: string
    userId: string
    role: $Enums.TeamRole
    joinedAt?: Date | string
  }

  export type TeamMemberCreateOrConnectWithoutTeamInput = {
    where: TeamMemberWhereUniqueInput
    create: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput>
  }

  export type TeamMemberCreateManyTeamInputEnvelope = {
    data: TeamMemberCreateManyTeamInput | TeamMemberCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type TeamBanCreateWithoutTeamInput = {
    id?: string
    bannedAt?: Date | string
    reason?: string | null
    user: UserCreateNestedOneWithoutTeamBansInput
  }

  export type TeamBanUncheckedCreateWithoutTeamInput = {
    id?: string
    userId: string
    bannedAt?: Date | string
    reason?: string | null
  }

  export type TeamBanCreateOrConnectWithoutTeamInput = {
    where: TeamBanWhereUniqueInput
    create: XOR<TeamBanCreateWithoutTeamInput, TeamBanUncheckedCreateWithoutTeamInput>
  }

  export type TeamBanCreateManyTeamInputEnvelope = {
    data: TeamBanCreateManyTeamInput | TeamBanCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type TeamRequestCreateWithoutTeamInput = {
    id?: string
    requestedAt?: Date | string
    status: $Enums.RequestStatus
    user: UserCreateNestedOneWithoutTeamJoinRequestsInput
  }

  export type TeamRequestUncheckedCreateWithoutTeamInput = {
    id?: string
    userId: string
    requestedAt?: Date | string
    status: $Enums.RequestStatus
  }

  export type TeamRequestCreateOrConnectWithoutTeamInput = {
    where: TeamRequestWhereUniqueInput
    create: XOR<TeamRequestCreateWithoutTeamInput, TeamRequestUncheckedCreateWithoutTeamInput>
  }

  export type TeamRequestCreateManyTeamInputEnvelope = {
    data: TeamRequestCreateManyTeamInput | TeamRequestCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type ProjectCreateWithoutTeamInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    owner: UserCreateNestedOneWithoutProjectsInput
    starredBy?: UserCreateNestedManyWithoutStarredProjectsInput
    archiveprojectBy?: UserCreateNestedOneWithoutArchieveProjectsInput
    genratedProjectsby?: UserCreateNestedOneWithoutAppsGeneratedInput
    files?: FileItemCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutTeamInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    ownerId: string
    generatedById?: string | null
    archeivedBy?: string | null
    createdAt?: Date | string
    starredBy?: UserUncheckedCreateNestedManyWithoutStarredProjectsInput
    files?: FileItemUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutTeamInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutTeamInput, ProjectUncheckedCreateWithoutTeamInput>
  }

  export type ProjectCreateManyTeamInputEnvelope = {
    data: ProjectCreateManyTeamInput | ProjectCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutTeamInput = {
    id?: string
    content: string
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutSentMessagesInput
    dmChatRoom?: FriendshipCreateNestedOneWithoutMessagesInput
    notifications?: NotificationCreateNestedManyWithoutMessageInput
    isDeletedBy?: UserCreateNestedManyWithoutDeletedMessagesInput
  }

  export type MessageUncheckedCreateWithoutTeamInput = {
    id?: string
    content: string
    senderId: string
    dmChatRoomId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutMessageInput
    isDeletedBy?: UserUncheckedCreateNestedManyWithoutDeletedMessagesInput
  }

  export type MessageCreateOrConnectWithoutTeamInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutTeamInput, MessageUncheckedCreateWithoutTeamInput>
  }

  export type MessageCreateManyTeamInputEnvelope = {
    data: MessageCreateManyTeamInput | MessageCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutTeamInput = {
    id?: string
    type?: $Enums.NotificationType
    content?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutSentNotificationsInput
    receiver: UserCreateNestedOneWithoutReceivedNotificationsInput
    message?: MessageCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutTeamInput = {
    id?: string
    senderId: string
    receiverId: string
    type?: $Enums.NotificationType
    content?: string | null
    messageId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutTeamInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutTeamInput, NotificationUncheckedCreateWithoutTeamInput>
  }

  export type NotificationCreateManyTeamInputEnvelope = {
    data: NotificationCreateManyTeamInput | NotificationCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type TeamMemberUpsertWithWhereUniqueWithoutTeamInput = {
    where: TeamMemberWhereUniqueInput
    update: XOR<TeamMemberUpdateWithoutTeamInput, TeamMemberUncheckedUpdateWithoutTeamInput>
    create: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput>
  }

  export type TeamMemberUpdateWithWhereUniqueWithoutTeamInput = {
    where: TeamMemberWhereUniqueInput
    data: XOR<TeamMemberUpdateWithoutTeamInput, TeamMemberUncheckedUpdateWithoutTeamInput>
  }

  export type TeamMemberUpdateManyWithWhereWithoutTeamInput = {
    where: TeamMemberScalarWhereInput
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyWithoutTeamInput>
  }

  export type TeamBanUpsertWithWhereUniqueWithoutTeamInput = {
    where: TeamBanWhereUniqueInput
    update: XOR<TeamBanUpdateWithoutTeamInput, TeamBanUncheckedUpdateWithoutTeamInput>
    create: XOR<TeamBanCreateWithoutTeamInput, TeamBanUncheckedCreateWithoutTeamInput>
  }

  export type TeamBanUpdateWithWhereUniqueWithoutTeamInput = {
    where: TeamBanWhereUniqueInput
    data: XOR<TeamBanUpdateWithoutTeamInput, TeamBanUncheckedUpdateWithoutTeamInput>
  }

  export type TeamBanUpdateManyWithWhereWithoutTeamInput = {
    where: TeamBanScalarWhereInput
    data: XOR<TeamBanUpdateManyMutationInput, TeamBanUncheckedUpdateManyWithoutTeamInput>
  }

  export type TeamRequestUpsertWithWhereUniqueWithoutTeamInput = {
    where: TeamRequestWhereUniqueInput
    update: XOR<TeamRequestUpdateWithoutTeamInput, TeamRequestUncheckedUpdateWithoutTeamInput>
    create: XOR<TeamRequestCreateWithoutTeamInput, TeamRequestUncheckedCreateWithoutTeamInput>
  }

  export type TeamRequestUpdateWithWhereUniqueWithoutTeamInput = {
    where: TeamRequestWhereUniqueInput
    data: XOR<TeamRequestUpdateWithoutTeamInput, TeamRequestUncheckedUpdateWithoutTeamInput>
  }

  export type TeamRequestUpdateManyWithWhereWithoutTeamInput = {
    where: TeamRequestScalarWhereInput
    data: XOR<TeamRequestUpdateManyMutationInput, TeamRequestUncheckedUpdateManyWithoutTeamInput>
  }

  export type ProjectUpsertWithWhereUniqueWithoutTeamInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutTeamInput, ProjectUncheckedUpdateWithoutTeamInput>
    create: XOR<ProjectCreateWithoutTeamInput, ProjectUncheckedCreateWithoutTeamInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutTeamInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutTeamInput, ProjectUncheckedUpdateWithoutTeamInput>
  }

  export type ProjectUpdateManyWithWhereWithoutTeamInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutTeamInput>
  }

  export type MessageUpsertWithWhereUniqueWithoutTeamInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutTeamInput, MessageUncheckedUpdateWithoutTeamInput>
    create: XOR<MessageCreateWithoutTeamInput, MessageUncheckedCreateWithoutTeamInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutTeamInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutTeamInput, MessageUncheckedUpdateWithoutTeamInput>
  }

  export type MessageUpdateManyWithWhereWithoutTeamInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutTeamInput>
  }

  export type NotificationUpsertWithWhereUniqueWithoutTeamInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutTeamInput, NotificationUncheckedUpdateWithoutTeamInput>
    create: XOR<NotificationCreateWithoutTeamInput, NotificationUncheckedCreateWithoutTeamInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutTeamInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutTeamInput, NotificationUncheckedUpdateWithoutTeamInput>
  }

  export type NotificationUpdateManyWithWhereWithoutTeamInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutTeamInput>
  }

  export type TeamCreateWithoutMembersInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    bannedUsers?: TeamBanCreateNestedManyWithoutTeamInput
    pendingRequests?: TeamRequestCreateNestedManyWithoutTeamInput
    projects?: ProjectCreateNestedManyWithoutTeamInput
    messages?: MessageCreateNestedManyWithoutTeamInput
    notifications?: NotificationCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    bannedUsers?: TeamBanUncheckedCreateNestedManyWithoutTeamInput
    pendingRequests?: TeamRequestUncheckedCreateNestedManyWithoutTeamInput
    projects?: ProjectUncheckedCreateNestedManyWithoutTeamInput
    messages?: MessageUncheckedCreateNestedManyWithoutTeamInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutMembersInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutMembersInput, TeamUncheckedCreateWithoutMembersInput>
  }

  export type UserCreateWithoutTeamsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectCreateNestedManyWithoutStarredByInput
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    teamJoinRequests?: TeamRequestCreateNestedManyWithoutUserInput
    teamBans?: TeamBanCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutTeamsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectUncheckedCreateNestedManyWithoutStarredByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    teamJoinRequests?: TeamRequestUncheckedCreateNestedManyWithoutUserInput
    teamBans?: TeamBanUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationUncheckedCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageUncheckedCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipUncheckedCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutTeamsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput>
  }

  export type TeamUpsertWithoutMembersInput = {
    update: XOR<TeamUpdateWithoutMembersInput, TeamUncheckedUpdateWithoutMembersInput>
    create: XOR<TeamCreateWithoutMembersInput, TeamUncheckedCreateWithoutMembersInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutMembersInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutMembersInput, TeamUncheckedUpdateWithoutMembersInput>
  }

  export type TeamUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bannedUsers?: TeamBanUpdateManyWithoutTeamNestedInput
    pendingRequests?: TeamRequestUpdateManyWithoutTeamNestedInput
    projects?: ProjectUpdateManyWithoutTeamNestedInput
    messages?: MessageUpdateManyWithoutTeamNestedInput
    notifications?: NotificationUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bannedUsers?: TeamBanUncheckedUpdateManyWithoutTeamNestedInput
    pendingRequests?: TeamRequestUncheckedUpdateManyWithoutTeamNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutTeamNestedInput
    messages?: MessageUncheckedUpdateManyWithoutTeamNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type UserUpsertWithoutTeamsInput = {
    update: XOR<UserUpdateWithoutTeamsInput, UserUncheckedUpdateWithoutTeamsInput>
    create: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTeamsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTeamsInput, UserUncheckedUpdateWithoutTeamsInput>
  }

  export type UserUpdateWithoutTeamsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    teamJoinRequests?: TeamRequestUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutTeamsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUncheckedUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    teamJoinRequests?: TeamRequestUncheckedUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUncheckedUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type TeamCreateWithoutBannedUsersInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberCreateNestedManyWithoutTeamInput
    pendingRequests?: TeamRequestCreateNestedManyWithoutTeamInput
    projects?: ProjectCreateNestedManyWithoutTeamInput
    messages?: MessageCreateNestedManyWithoutTeamInput
    notifications?: NotificationCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutBannedUsersInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberUncheckedCreateNestedManyWithoutTeamInput
    pendingRequests?: TeamRequestUncheckedCreateNestedManyWithoutTeamInput
    projects?: ProjectUncheckedCreateNestedManyWithoutTeamInput
    messages?: MessageUncheckedCreateNestedManyWithoutTeamInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutBannedUsersInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutBannedUsersInput, TeamUncheckedCreateWithoutBannedUsersInput>
  }

  export type UserCreateWithoutTeamBansInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectCreateNestedManyWithoutStarredByInput
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutTeamBansInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectUncheckedCreateNestedManyWithoutStarredByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationUncheckedCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageUncheckedCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipUncheckedCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutTeamBansInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTeamBansInput, UserUncheckedCreateWithoutTeamBansInput>
  }

  export type TeamUpsertWithoutBannedUsersInput = {
    update: XOR<TeamUpdateWithoutBannedUsersInput, TeamUncheckedUpdateWithoutBannedUsersInput>
    create: XOR<TeamCreateWithoutBannedUsersInput, TeamUncheckedCreateWithoutBannedUsersInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutBannedUsersInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutBannedUsersInput, TeamUncheckedUpdateWithoutBannedUsersInput>
  }

  export type TeamUpdateWithoutBannedUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUpdateManyWithoutTeamNestedInput
    pendingRequests?: TeamRequestUpdateManyWithoutTeamNestedInput
    projects?: ProjectUpdateManyWithoutTeamNestedInput
    messages?: MessageUpdateManyWithoutTeamNestedInput
    notifications?: NotificationUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutBannedUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUncheckedUpdateManyWithoutTeamNestedInput
    pendingRequests?: TeamRequestUncheckedUpdateManyWithoutTeamNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutTeamNestedInput
    messages?: MessageUncheckedUpdateManyWithoutTeamNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type UserUpsertWithoutTeamBansInput = {
    update: XOR<UserUpdateWithoutTeamBansInput, UserUncheckedUpdateWithoutTeamBansInput>
    create: XOR<UserCreateWithoutTeamBansInput, UserUncheckedCreateWithoutTeamBansInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTeamBansInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTeamBansInput, UserUncheckedUpdateWithoutTeamBansInput>
  }

  export type UserUpdateWithoutTeamBansInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutTeamBansInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUncheckedUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUncheckedUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type TeamCreateWithoutPendingRequestsInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberCreateNestedManyWithoutTeamInput
    bannedUsers?: TeamBanCreateNestedManyWithoutTeamInput
    projects?: ProjectCreateNestedManyWithoutTeamInput
    messages?: MessageCreateNestedManyWithoutTeamInput
    notifications?: NotificationCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutPendingRequestsInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberUncheckedCreateNestedManyWithoutTeamInput
    bannedUsers?: TeamBanUncheckedCreateNestedManyWithoutTeamInput
    projects?: ProjectUncheckedCreateNestedManyWithoutTeamInput
    messages?: MessageUncheckedCreateNestedManyWithoutTeamInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutPendingRequestsInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutPendingRequestsInput, TeamUncheckedCreateWithoutPendingRequestsInput>
  }

  export type UserCreateWithoutTeamJoinRequestsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectCreateNestedManyWithoutStarredByInput
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberCreateNestedManyWithoutUserInput
    teamBans?: TeamBanCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutTeamJoinRequestsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectUncheckedCreateNestedManyWithoutStarredByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    teamBans?: TeamBanUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationUncheckedCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageUncheckedCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipUncheckedCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutTeamJoinRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTeamJoinRequestsInput, UserUncheckedCreateWithoutTeamJoinRequestsInput>
  }

  export type TeamUpsertWithoutPendingRequestsInput = {
    update: XOR<TeamUpdateWithoutPendingRequestsInput, TeamUncheckedUpdateWithoutPendingRequestsInput>
    create: XOR<TeamCreateWithoutPendingRequestsInput, TeamUncheckedCreateWithoutPendingRequestsInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutPendingRequestsInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutPendingRequestsInput, TeamUncheckedUpdateWithoutPendingRequestsInput>
  }

  export type TeamUpdateWithoutPendingRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUpdateManyWithoutTeamNestedInput
    bannedUsers?: TeamBanUpdateManyWithoutTeamNestedInput
    projects?: ProjectUpdateManyWithoutTeamNestedInput
    messages?: MessageUpdateManyWithoutTeamNestedInput
    notifications?: NotificationUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutPendingRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUncheckedUpdateManyWithoutTeamNestedInput
    bannedUsers?: TeamBanUncheckedUpdateManyWithoutTeamNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutTeamNestedInput
    messages?: MessageUncheckedUpdateManyWithoutTeamNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type UserUpsertWithoutTeamJoinRequestsInput = {
    update: XOR<UserUpdateWithoutTeamJoinRequestsInput, UserUncheckedUpdateWithoutTeamJoinRequestsInput>
    create: XOR<UserCreateWithoutTeamJoinRequestsInput, UserUncheckedCreateWithoutTeamJoinRequestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTeamJoinRequestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTeamJoinRequestsInput, UserUncheckedUpdateWithoutTeamJoinRequestsInput>
  }

  export type UserUpdateWithoutTeamJoinRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutTeamJoinRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUncheckedUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUncheckedUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserCreateWithoutProjectsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectCreateNestedManyWithoutStarredByInput
    teams?: TeamMemberCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestCreateNestedManyWithoutUserInput
    teamBans?: TeamBanCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutProjectsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectUncheckedCreateNestedManyWithoutStarredByInput
    teams?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestUncheckedCreateNestedManyWithoutUserInput
    teamBans?: TeamBanUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationUncheckedCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageUncheckedCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipUncheckedCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutProjectsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
  }

  export type TeamCreateWithoutProjectsInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberCreateNestedManyWithoutTeamInput
    bannedUsers?: TeamBanCreateNestedManyWithoutTeamInput
    pendingRequests?: TeamRequestCreateNestedManyWithoutTeamInput
    messages?: MessageCreateNestedManyWithoutTeamInput
    notifications?: NotificationCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutProjectsInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberUncheckedCreateNestedManyWithoutTeamInput
    bannedUsers?: TeamBanUncheckedCreateNestedManyWithoutTeamInput
    pendingRequests?: TeamRequestUncheckedCreateNestedManyWithoutTeamInput
    messages?: MessageUncheckedCreateNestedManyWithoutTeamInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutProjectsInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutProjectsInput, TeamUncheckedCreateWithoutProjectsInput>
  }

  export type UserCreateWithoutStarredProjectsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectCreateNestedManyWithoutGenratedProjectsbyInput
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestCreateNestedManyWithoutUserInput
    teamBans?: TeamBanCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutStarredProjectsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestUncheckedCreateNestedManyWithoutUserInput
    teamBans?: TeamBanUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationUncheckedCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageUncheckedCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipUncheckedCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutStarredProjectsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStarredProjectsInput, UserUncheckedCreateWithoutStarredProjectsInput>
  }

  export type UserCreateWithoutArchieveProjectsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    appsGenerated?: ProjectCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectCreateNestedManyWithoutStarredByInput
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestCreateNestedManyWithoutUserInput
    teamBans?: TeamBanCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutArchieveProjectsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    appsGenerated?: ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectUncheckedCreateNestedManyWithoutStarredByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestUncheckedCreateNestedManyWithoutUserInput
    teamBans?: TeamBanUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationUncheckedCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageUncheckedCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipUncheckedCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutArchieveProjectsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutArchieveProjectsInput, UserUncheckedCreateWithoutArchieveProjectsInput>
  }

  export type UserCreateWithoutAppsGeneratedInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectCreateNestedManyWithoutArchiveprojectByInput
    starredProjects?: ProjectCreateNestedManyWithoutStarredByInput
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestCreateNestedManyWithoutUserInput
    teamBans?: TeamBanCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutAppsGeneratedInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput
    starredProjects?: ProjectUncheckedCreateNestedManyWithoutStarredByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestUncheckedCreateNestedManyWithoutUserInput
    teamBans?: TeamBanUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationUncheckedCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageUncheckedCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipUncheckedCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutAppsGeneratedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAppsGeneratedInput, UserUncheckedCreateWithoutAppsGeneratedInput>
  }

  export type FileItemCreateWithoutProjectInput = {
    id?: string
    name: string
    type: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: FileItemCreateNestedOneWithoutChildrenInput
    children?: FileItemCreateNestedManyWithoutParentInput
  }

  export type FileItemUncheckedCreateWithoutProjectInput = {
    id?: string
    name: string
    type: string
    content: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: FileItemUncheckedCreateNestedManyWithoutParentInput
  }

  export type FileItemCreateOrConnectWithoutProjectInput = {
    where: FileItemWhereUniqueInput
    create: XOR<FileItemCreateWithoutProjectInput, FileItemUncheckedCreateWithoutProjectInput>
  }

  export type FileItemCreateManyProjectInputEnvelope = {
    data: FileItemCreateManyProjectInput | FileItemCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutProjectsInput = {
    update: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProjectsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type UserUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUpdateManyWithoutStarredByNestedInput
    teams?: TeamMemberUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUncheckedUpdateManyWithoutStarredByNestedInput
    teams?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUncheckedUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUncheckedUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type TeamUpsertWithoutProjectsInput = {
    update: XOR<TeamUpdateWithoutProjectsInput, TeamUncheckedUpdateWithoutProjectsInput>
    create: XOR<TeamCreateWithoutProjectsInput, TeamUncheckedCreateWithoutProjectsInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutProjectsInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutProjectsInput, TeamUncheckedUpdateWithoutProjectsInput>
  }

  export type TeamUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUpdateManyWithoutTeamNestedInput
    bannedUsers?: TeamBanUpdateManyWithoutTeamNestedInput
    pendingRequests?: TeamRequestUpdateManyWithoutTeamNestedInput
    messages?: MessageUpdateManyWithoutTeamNestedInput
    notifications?: NotificationUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUncheckedUpdateManyWithoutTeamNestedInput
    bannedUsers?: TeamBanUncheckedUpdateManyWithoutTeamNestedInput
    pendingRequests?: TeamRequestUncheckedUpdateManyWithoutTeamNestedInput
    messages?: MessageUncheckedUpdateManyWithoutTeamNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type UserUpsertWithWhereUniqueWithoutStarredProjectsInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutStarredProjectsInput, UserUncheckedUpdateWithoutStarredProjectsInput>
    create: XOR<UserCreateWithoutStarredProjectsInput, UserUncheckedCreateWithoutStarredProjectsInput>
  }

  export type UserUpdateWithWhereUniqueWithoutStarredProjectsInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutStarredProjectsInput, UserUncheckedUpdateWithoutStarredProjectsInput>
  }

  export type UserUpdateManyWithWhereWithoutStarredProjectsInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutStarredProjectsInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    avatar?: StringNullableFilter<"User"> | string | null
    githubUrl?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
  }

  export type UserUpsertWithoutArchieveProjectsInput = {
    update: XOR<UserUpdateWithoutArchieveProjectsInput, UserUncheckedUpdateWithoutArchieveProjectsInput>
    create: XOR<UserCreateWithoutArchieveProjectsInput, UserUncheckedCreateWithoutArchieveProjectsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutArchieveProjectsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutArchieveProjectsInput, UserUncheckedUpdateWithoutArchieveProjectsInput>
  }

  export type UserUpdateWithoutArchieveProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    appsGenerated?: ProjectUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutArchieveProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    appsGenerated?: ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUncheckedUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUncheckedUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUncheckedUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUpsertWithoutAppsGeneratedInput = {
    update: XOR<UserUpdateWithoutAppsGeneratedInput, UserUncheckedUpdateWithoutAppsGeneratedInput>
    create: XOR<UserCreateWithoutAppsGeneratedInput, UserUncheckedCreateWithoutAppsGeneratedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAppsGeneratedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAppsGeneratedInput, UserUncheckedUpdateWithoutAppsGeneratedInput>
  }

  export type UserUpdateWithoutAppsGeneratedInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUpdateManyWithoutArchiveprojectByNestedInput
    starredProjects?: ProjectUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutAppsGeneratedInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput
    starredProjects?: ProjectUncheckedUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUncheckedUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUncheckedUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type FileItemUpsertWithWhereUniqueWithoutProjectInput = {
    where: FileItemWhereUniqueInput
    update: XOR<FileItemUpdateWithoutProjectInput, FileItemUncheckedUpdateWithoutProjectInput>
    create: XOR<FileItemCreateWithoutProjectInput, FileItemUncheckedCreateWithoutProjectInput>
  }

  export type FileItemUpdateWithWhereUniqueWithoutProjectInput = {
    where: FileItemWhereUniqueInput
    data: XOR<FileItemUpdateWithoutProjectInput, FileItemUncheckedUpdateWithoutProjectInput>
  }

  export type FileItemUpdateManyWithWhereWithoutProjectInput = {
    where: FileItemScalarWhereInput
    data: XOR<FileItemUpdateManyMutationInput, FileItemUncheckedUpdateManyWithoutProjectInput>
  }

  export type FileItemScalarWhereInput = {
    AND?: FileItemScalarWhereInput | FileItemScalarWhereInput[]
    OR?: FileItemScalarWhereInput[]
    NOT?: FileItemScalarWhereInput | FileItemScalarWhereInput[]
    id?: StringFilter<"FileItem"> | string
    name?: StringFilter<"FileItem"> | string
    type?: StringFilter<"FileItem"> | string
    content?: StringFilter<"FileItem"> | string
    projectId?: StringFilter<"FileItem"> | string
    parentId?: StringNullableFilter<"FileItem"> | string | null
    createdAt?: DateTimeFilter<"FileItem"> | Date | string
    updatedAt?: DateTimeFilter<"FileItem"> | Date | string
  }

  export type ProjectCreateWithoutFilesInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    owner: UserCreateNestedOneWithoutProjectsInput
    team?: TeamCreateNestedOneWithoutProjectsInput
    starredBy?: UserCreateNestedManyWithoutStarredProjectsInput
    archiveprojectBy?: UserCreateNestedOneWithoutArchieveProjectsInput
    genratedProjectsby?: UserCreateNestedOneWithoutAppsGeneratedInput
  }

  export type ProjectUncheckedCreateWithoutFilesInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    ownerId: string
    teamId?: string | null
    generatedById?: string | null
    archeivedBy?: string | null
    createdAt?: Date | string
    starredBy?: UserUncheckedCreateNestedManyWithoutStarredProjectsInput
  }

  export type ProjectCreateOrConnectWithoutFilesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
  }

  export type FileItemCreateWithoutChildrenInput = {
    id?: string
    name: string
    type: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutFilesInput
    parent?: FileItemCreateNestedOneWithoutChildrenInput
  }

  export type FileItemUncheckedCreateWithoutChildrenInput = {
    id?: string
    name: string
    type: string
    content: string
    projectId: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileItemCreateOrConnectWithoutChildrenInput = {
    where: FileItemWhereUniqueInput
    create: XOR<FileItemCreateWithoutChildrenInput, FileItemUncheckedCreateWithoutChildrenInput>
  }

  export type FileItemCreateWithoutParentInput = {
    id?: string
    name: string
    type: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutFilesInput
    children?: FileItemCreateNestedManyWithoutParentInput
  }

  export type FileItemUncheckedCreateWithoutParentInput = {
    id?: string
    name: string
    type: string
    content: string
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: FileItemUncheckedCreateNestedManyWithoutParentInput
  }

  export type FileItemCreateOrConnectWithoutParentInput = {
    where: FileItemWhereUniqueInput
    create: XOR<FileItemCreateWithoutParentInput, FileItemUncheckedCreateWithoutParentInput>
  }

  export type FileItemCreateManyParentInputEnvelope = {
    data: FileItemCreateManyParentInput | FileItemCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutFilesInput = {
    update: XOR<ProjectUpdateWithoutFilesInput, ProjectUncheckedUpdateWithoutFilesInput>
    create: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutFilesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutFilesInput, ProjectUncheckedUpdateWithoutFilesInput>
  }

  export type ProjectUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutProjectsNestedInput
    team?: TeamUpdateOneWithoutProjectsNestedInput
    starredBy?: UserUpdateManyWithoutStarredProjectsNestedInput
    archiveprojectBy?: UserUpdateOneWithoutArchieveProjectsNestedInput
    genratedProjectsby?: UserUpdateOneWithoutAppsGeneratedNestedInput
  }

  export type ProjectUncheckedUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerId?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    generatedById?: NullableStringFieldUpdateOperationsInput | string | null
    archeivedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    starredBy?: UserUncheckedUpdateManyWithoutStarredProjectsNestedInput
  }

  export type FileItemUpsertWithoutChildrenInput = {
    update: XOR<FileItemUpdateWithoutChildrenInput, FileItemUncheckedUpdateWithoutChildrenInput>
    create: XOR<FileItemCreateWithoutChildrenInput, FileItemUncheckedCreateWithoutChildrenInput>
    where?: FileItemWhereInput
  }

  export type FileItemUpdateToOneWithWhereWithoutChildrenInput = {
    where?: FileItemWhereInput
    data: XOR<FileItemUpdateWithoutChildrenInput, FileItemUncheckedUpdateWithoutChildrenInput>
  }

  export type FileItemUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutFilesNestedInput
    parent?: FileItemUpdateOneWithoutChildrenNestedInput
  }

  export type FileItemUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileItemUpsertWithWhereUniqueWithoutParentInput = {
    where: FileItemWhereUniqueInput
    update: XOR<FileItemUpdateWithoutParentInput, FileItemUncheckedUpdateWithoutParentInput>
    create: XOR<FileItemCreateWithoutParentInput, FileItemUncheckedCreateWithoutParentInput>
  }

  export type FileItemUpdateWithWhereUniqueWithoutParentInput = {
    where: FileItemWhereUniqueInput
    data: XOR<FileItemUpdateWithoutParentInput, FileItemUncheckedUpdateWithoutParentInput>
  }

  export type FileItemUpdateManyWithWhereWithoutParentInput = {
    where: FileItemScalarWhereInput
    data: XOR<FileItemUpdateManyMutationInput, FileItemUncheckedUpdateManyWithoutParentInput>
  }

  export type UserCreateWithoutSentMessagesInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectCreateNestedManyWithoutStarredByInput
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestCreateNestedManyWithoutUserInput
    teamBans?: TeamBanCreateNestedManyWithoutUserInput
    sentNotifications?: NotificationCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutSentMessagesInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectUncheckedCreateNestedManyWithoutStarredByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestUncheckedCreateNestedManyWithoutUserInput
    teamBans?: TeamBanUncheckedCreateNestedManyWithoutUserInput
    sentNotifications?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationUncheckedCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageUncheckedCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipUncheckedCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutSentMessagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSentMessagesInput, UserUncheckedCreateWithoutSentMessagesInput>
  }

  export type FriendshipCreateWithoutMessagesInput = {
    id?: string
    status: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    initiator: UserCreateNestedOneWithoutFriendshipsInitiatedInput
    receiver: UserCreateNestedOneWithoutFriendshipsReceivedInput
  }

  export type FriendshipUncheckedCreateWithoutMessagesInput = {
    id?: string
    initiatorId: string
    receiverId: string
    status: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipCreateOrConnectWithoutMessagesInput = {
    where: FriendshipWhereUniqueInput
    create: XOR<FriendshipCreateWithoutMessagesInput, FriendshipUncheckedCreateWithoutMessagesInput>
  }

  export type TeamCreateWithoutMessagesInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberCreateNestedManyWithoutTeamInput
    bannedUsers?: TeamBanCreateNestedManyWithoutTeamInput
    pendingRequests?: TeamRequestCreateNestedManyWithoutTeamInput
    projects?: ProjectCreateNestedManyWithoutTeamInput
    notifications?: NotificationCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutMessagesInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberUncheckedCreateNestedManyWithoutTeamInput
    bannedUsers?: TeamBanUncheckedCreateNestedManyWithoutTeamInput
    pendingRequests?: TeamRequestUncheckedCreateNestedManyWithoutTeamInput
    projects?: ProjectUncheckedCreateNestedManyWithoutTeamInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutMessagesInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutMessagesInput, TeamUncheckedCreateWithoutMessagesInput>
  }

  export type NotificationCreateWithoutMessageInput = {
    id?: string
    type?: $Enums.NotificationType
    content?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutSentNotificationsInput
    receiver: UserCreateNestedOneWithoutReceivedNotificationsInput
    team?: TeamCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutMessageInput = {
    id?: string
    senderId: string
    receiverId: string
    type?: $Enums.NotificationType
    content?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutMessageInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutMessageInput, NotificationUncheckedCreateWithoutMessageInput>
  }

  export type NotificationCreateManyMessageInputEnvelope = {
    data: NotificationCreateManyMessageInput | NotificationCreateManyMessageInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutDeletedMessagesInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectCreateNestedManyWithoutStarredByInput
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestCreateNestedManyWithoutUserInput
    teamBans?: TeamBanCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationCreateNestedManyWithoutReceiverInput
    friendshipsInitiated?: FriendshipCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutDeletedMessagesInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectUncheckedCreateNestedManyWithoutStarredByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestUncheckedCreateNestedManyWithoutUserInput
    teamBans?: TeamBanUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationUncheckedCreateNestedManyWithoutReceiverInput
    friendshipsInitiated?: FriendshipUncheckedCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutDeletedMessagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDeletedMessagesInput, UserUncheckedCreateWithoutDeletedMessagesInput>
  }

  export type UserUpsertWithoutSentMessagesInput = {
    update: XOR<UserUpdateWithoutSentMessagesInput, UserUncheckedUpdateWithoutSentMessagesInput>
    create: XOR<UserCreateWithoutSentMessagesInput, UserUncheckedCreateWithoutSentMessagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSentMessagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSentMessagesInput, UserUncheckedUpdateWithoutSentMessagesInput>
  }

  export type UserUpdateWithoutSentMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUpdateManyWithoutUserNestedInput
    sentNotifications?: NotificationUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutSentMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUncheckedUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUncheckedUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUncheckedUpdateManyWithoutUserNestedInput
    sentNotifications?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUncheckedUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type FriendshipUpsertWithoutMessagesInput = {
    update: XOR<FriendshipUpdateWithoutMessagesInput, FriendshipUncheckedUpdateWithoutMessagesInput>
    create: XOR<FriendshipCreateWithoutMessagesInput, FriendshipUncheckedCreateWithoutMessagesInput>
    where?: FriendshipWhereInput
  }

  export type FriendshipUpdateToOneWithWhereWithoutMessagesInput = {
    where?: FriendshipWhereInput
    data: XOR<FriendshipUpdateWithoutMessagesInput, FriendshipUncheckedUpdateWithoutMessagesInput>
  }

  export type FriendshipUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    initiator?: UserUpdateOneRequiredWithoutFriendshipsInitiatedNestedInput
    receiver?: UserUpdateOneRequiredWithoutFriendshipsReceivedNestedInput
  }

  export type FriendshipUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamUpsertWithoutMessagesInput = {
    update: XOR<TeamUpdateWithoutMessagesInput, TeamUncheckedUpdateWithoutMessagesInput>
    create: XOR<TeamCreateWithoutMessagesInput, TeamUncheckedCreateWithoutMessagesInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutMessagesInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutMessagesInput, TeamUncheckedUpdateWithoutMessagesInput>
  }

  export type TeamUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUpdateManyWithoutTeamNestedInput
    bannedUsers?: TeamBanUpdateManyWithoutTeamNestedInput
    pendingRequests?: TeamRequestUpdateManyWithoutTeamNestedInput
    projects?: ProjectUpdateManyWithoutTeamNestedInput
    notifications?: NotificationUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUncheckedUpdateManyWithoutTeamNestedInput
    bannedUsers?: TeamBanUncheckedUpdateManyWithoutTeamNestedInput
    pendingRequests?: TeamRequestUncheckedUpdateManyWithoutTeamNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutTeamNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type NotificationUpsertWithWhereUniqueWithoutMessageInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutMessageInput, NotificationUncheckedUpdateWithoutMessageInput>
    create: XOR<NotificationCreateWithoutMessageInput, NotificationUncheckedCreateWithoutMessageInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutMessageInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutMessageInput, NotificationUncheckedUpdateWithoutMessageInput>
  }

  export type NotificationUpdateManyWithWhereWithoutMessageInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutMessageInput>
  }

  export type UserUpsertWithWhereUniqueWithoutDeletedMessagesInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutDeletedMessagesInput, UserUncheckedUpdateWithoutDeletedMessagesInput>
    create: XOR<UserCreateWithoutDeletedMessagesInput, UserUncheckedCreateWithoutDeletedMessagesInput>
  }

  export type UserUpdateWithWhereUniqueWithoutDeletedMessagesInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutDeletedMessagesInput, UserUncheckedUpdateWithoutDeletedMessagesInput>
  }

  export type UserUpdateManyWithWhereWithoutDeletedMessagesInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutDeletedMessagesInput>
  }

  export type UserCreateWithoutSentNotificationsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectCreateNestedManyWithoutStarredByInput
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestCreateNestedManyWithoutUserInput
    teamBans?: TeamBanCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutSentNotificationsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectUncheckedCreateNestedManyWithoutStarredByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestUncheckedCreateNestedManyWithoutUserInput
    teamBans?: TeamBanUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedNotifications?: NotificationUncheckedCreateNestedManyWithoutReceiverInput
    deletedMessages?: MessageUncheckedCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipUncheckedCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutSentNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSentNotificationsInput, UserUncheckedCreateWithoutSentNotificationsInput>
  }

  export type UserCreateWithoutReceivedNotificationsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectCreateNestedManyWithoutStarredByInput
    projects?: ProjectCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestCreateNestedManyWithoutUserInput
    teamBans?: TeamBanCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationCreateNestedManyWithoutSenderInput
    deletedMessages?: MessageCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutReceivedNotificationsInput = {
    id?: string
    fullName: string
    email: string
    username: string
    password?: string | null
    createdAt?: Date | string
    avatar?: string | null
    githubUrl?: string | null
    bio?: string | null
    archieveProjects?: ProjectUncheckedCreateNestedManyWithoutArchiveprojectByInput
    appsGenerated?: ProjectUncheckedCreateNestedManyWithoutGenratedProjectsbyInput
    starredProjects?: ProjectUncheckedCreateNestedManyWithoutStarredByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    teams?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    teamJoinRequests?: TeamRequestUncheckedCreateNestedManyWithoutUserInput
    teamBans?: TeamBanUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentNotifications?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    deletedMessages?: MessageUncheckedCreateNestedManyWithoutIsDeletedByInput
    friendshipsInitiated?: FriendshipUncheckedCreateNestedManyWithoutInitiatorInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutReceivedNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReceivedNotificationsInput, UserUncheckedCreateWithoutReceivedNotificationsInput>
  }

  export type MessageCreateWithoutNotificationsInput = {
    id?: string
    content: string
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutSentMessagesInput
    dmChatRoom?: FriendshipCreateNestedOneWithoutMessagesInput
    team?: TeamCreateNestedOneWithoutMessagesInput
    isDeletedBy?: UserCreateNestedManyWithoutDeletedMessagesInput
  }

  export type MessageUncheckedCreateWithoutNotificationsInput = {
    id?: string
    content: string
    senderId: string
    dmChatRoomId?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeletedBy?: UserUncheckedCreateNestedManyWithoutDeletedMessagesInput
  }

  export type MessageCreateOrConnectWithoutNotificationsInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutNotificationsInput, MessageUncheckedCreateWithoutNotificationsInput>
  }

  export type TeamCreateWithoutNotificationsInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberCreateNestedManyWithoutTeamInput
    bannedUsers?: TeamBanCreateNestedManyWithoutTeamInput
    pendingRequests?: TeamRequestCreateNestedManyWithoutTeamInput
    projects?: ProjectCreateNestedManyWithoutTeamInput
    messages?: MessageCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutNotificationsInput = {
    id?: string
    name: string
    type: $Enums.TeamType
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberUncheckedCreateNestedManyWithoutTeamInput
    bannedUsers?: TeamBanUncheckedCreateNestedManyWithoutTeamInput
    pendingRequests?: TeamRequestUncheckedCreateNestedManyWithoutTeamInput
    projects?: ProjectUncheckedCreateNestedManyWithoutTeamInput
    messages?: MessageUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutNotificationsInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutNotificationsInput, TeamUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutSentNotificationsInput = {
    update: XOR<UserUpdateWithoutSentNotificationsInput, UserUncheckedUpdateWithoutSentNotificationsInput>
    create: XOR<UserCreateWithoutSentNotificationsInput, UserUncheckedCreateWithoutSentNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSentNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSentNotificationsInput, UserUncheckedUpdateWithoutSentNotificationsInput>
  }

  export type UserUpdateWithoutSentNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutSentNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUncheckedUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUncheckedUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUncheckedUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUpsertWithoutReceivedNotificationsInput = {
    update: XOR<UserUpdateWithoutReceivedNotificationsInput, UserUncheckedUpdateWithoutReceivedNotificationsInput>
    create: XOR<UserCreateWithoutReceivedNotificationsInput, UserUncheckedCreateWithoutReceivedNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReceivedNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReceivedNotificationsInput, UserUncheckedUpdateWithoutReceivedNotificationsInput>
  }

  export type UserUpdateWithoutReceivedNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUpdateManyWithoutSenderNestedInput
    deletedMessages?: MessageUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutReceivedNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUncheckedUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUncheckedUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    deletedMessages?: MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type MessageUpsertWithoutNotificationsInput = {
    update: XOR<MessageUpdateWithoutNotificationsInput, MessageUncheckedUpdateWithoutNotificationsInput>
    create: XOR<MessageCreateWithoutNotificationsInput, MessageUncheckedCreateWithoutNotificationsInput>
    where?: MessageWhereInput
  }

  export type MessageUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: MessageWhereInput
    data: XOR<MessageUpdateWithoutNotificationsInput, MessageUncheckedUpdateWithoutNotificationsInput>
  }

  export type MessageUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput
    dmChatRoom?: FriendshipUpdateOneWithoutMessagesNestedInput
    team?: TeamUpdateOneWithoutMessagesNestedInput
    isDeletedBy?: UserUpdateManyWithoutDeletedMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    dmChatRoomId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeletedBy?: UserUncheckedUpdateManyWithoutDeletedMessagesNestedInput
  }

  export type TeamUpsertWithoutNotificationsInput = {
    update: XOR<TeamUpdateWithoutNotificationsInput, TeamUncheckedUpdateWithoutNotificationsInput>
    create: XOR<TeamCreateWithoutNotificationsInput, TeamUncheckedCreateWithoutNotificationsInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutNotificationsInput, TeamUncheckedUpdateWithoutNotificationsInput>
  }

  export type TeamUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUpdateManyWithoutTeamNestedInput
    bannedUsers?: TeamBanUpdateManyWithoutTeamNestedInput
    pendingRequests?: TeamRequestUpdateManyWithoutTeamNestedInput
    projects?: ProjectUpdateManyWithoutTeamNestedInput
    messages?: MessageUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTeamTypeFieldUpdateOperationsInput | $Enums.TeamType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUncheckedUpdateManyWithoutTeamNestedInput
    bannedUsers?: TeamBanUncheckedUpdateManyWithoutTeamNestedInput
    pendingRequests?: TeamRequestUncheckedUpdateManyWithoutTeamNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutTeamNestedInput
    messages?: MessageUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type ProjectCreateManyArchiveprojectByInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    ownerId: string
    teamId?: string | null
    generatedById?: string | null
    createdAt?: Date | string
  }

  export type ProjectCreateManyGenratedProjectsbyInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    ownerId: string
    teamId?: string | null
    archeivedBy?: string | null
    createdAt?: Date | string
  }

  export type ProjectCreateManyOwnerInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    teamId?: string | null
    generatedById?: string | null
    archeivedBy?: string | null
    createdAt?: Date | string
  }

  export type TeamMemberCreateManyUserInput = {
    id?: string
    teamId: string
    role: $Enums.TeamRole
    joinedAt?: Date | string
  }

  export type TeamRequestCreateManyUserInput = {
    id?: string
    teamId: string
    requestedAt?: Date | string
    status: $Enums.RequestStatus
  }

  export type TeamBanCreateManyUserInput = {
    id?: string
    teamId: string
    bannedAt?: Date | string
    reason?: string | null
  }

  export type MessageCreateManySenderInput = {
    id?: string
    content: string
    dmChatRoomId?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManySenderInput = {
    id?: string
    receiverId: string
    type?: $Enums.NotificationType
    content?: string | null
    messageId?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyReceiverInput = {
    id?: string
    senderId: string
    type?: $Enums.NotificationType
    content?: string | null
    messageId?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipCreateManyInitiatorInput = {
    id?: string
    receiverId: string
    status: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipCreateManyReceiverInput = {
    id?: string
    initiatorId: string
    status: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateWithoutArchiveprojectByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutProjectsNestedInput
    team?: TeamUpdateOneWithoutProjectsNestedInput
    starredBy?: UserUpdateManyWithoutStarredProjectsNestedInput
    genratedProjectsby?: UserUpdateOneWithoutAppsGeneratedNestedInput
    files?: FileItemUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutArchiveprojectByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerId?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    generatedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    starredBy?: UserUncheckedUpdateManyWithoutStarredProjectsNestedInput
    files?: FileItemUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutArchiveprojectByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerId?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    generatedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUpdateWithoutGenratedProjectsbyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutProjectsNestedInput
    team?: TeamUpdateOneWithoutProjectsNestedInput
    starredBy?: UserUpdateManyWithoutStarredProjectsNestedInput
    archiveprojectBy?: UserUpdateOneWithoutArchieveProjectsNestedInput
    files?: FileItemUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutGenratedProjectsbyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerId?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    archeivedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    starredBy?: UserUncheckedUpdateManyWithoutStarredProjectsNestedInput
    files?: FileItemUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutGenratedProjectsbyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerId?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    archeivedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUpdateWithoutStarredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutProjectsNestedInput
    team?: TeamUpdateOneWithoutProjectsNestedInput
    archiveprojectBy?: UserUpdateOneWithoutArchieveProjectsNestedInput
    genratedProjectsby?: UserUpdateOneWithoutAppsGeneratedNestedInput
    files?: FileItemUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutStarredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerId?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    generatedById?: NullableStringFieldUpdateOperationsInput | string | null
    archeivedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: FileItemUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutStarredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerId?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    generatedById?: NullableStringFieldUpdateOperationsInput | string | null
    archeivedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneWithoutProjectsNestedInput
    starredBy?: UserUpdateManyWithoutStarredProjectsNestedInput
    archiveprojectBy?: UserUpdateOneWithoutArchieveProjectsNestedInput
    genratedProjectsby?: UserUpdateOneWithoutAppsGeneratedNestedInput
    files?: FileItemUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    generatedById?: NullableStringFieldUpdateOperationsInput | string | null
    archeivedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    starredBy?: UserUncheckedUpdateManyWithoutStarredProjectsNestedInput
    files?: FileItemUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    generatedById?: NullableStringFieldUpdateOperationsInput | string | null
    archeivedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneRequiredWithoutMembersNestedInput
  }

  export type TeamMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamRequestUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    team?: TeamUpdateOneRequiredWithoutPendingRequestsNestedInput
  }

  export type TeamRequestUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
  }

  export type TeamRequestUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
  }

  export type TeamBanUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    team?: TeamUpdateOneRequiredWithoutBannedUsersNestedInput
  }

  export type TeamBanUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamBanUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dmChatRoom?: FriendshipUpdateOneWithoutMessagesNestedInput
    team?: TeamUpdateOneWithoutMessagesNestedInput
    notifications?: NotificationUpdateManyWithoutMessageNestedInput
    isDeletedBy?: UserUpdateManyWithoutDeletedMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    dmChatRoomId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutMessageNestedInput
    isDeletedBy?: UserUncheckedUpdateManyWithoutDeletedMessagesNestedInput
  }

  export type MessageUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    dmChatRoomId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receiver?: UserUpdateOneRequiredWithoutReceivedNotificationsNestedInput
    message?: MessageUpdateOneWithoutNotificationsNestedInput
    team?: TeamUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    messageId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    messageId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutSentNotificationsNestedInput
    message?: MessageUpdateOneWithoutNotificationsNestedInput
    team?: TeamUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    messageId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    messageId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUpdateWithoutIsDeletedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput
    dmChatRoom?: FriendshipUpdateOneWithoutMessagesNestedInput
    team?: TeamUpdateOneWithoutMessagesNestedInput
    notifications?: NotificationUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateWithoutIsDeletedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    dmChatRoomId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateManyWithoutIsDeletedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    dmChatRoomId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUpdateWithoutInitiatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receiver?: UserUpdateOneRequiredWithoutFriendshipsReceivedNestedInput
    messages?: MessageUpdateManyWithoutDmChatRoomNestedInput
  }

  export type FriendshipUncheckedUpdateWithoutInitiatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutDmChatRoomNestedInput
  }

  export type FriendshipUncheckedUpdateManyWithoutInitiatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    initiator?: UserUpdateOneRequiredWithoutFriendshipsInitiatedNestedInput
    messages?: MessageUpdateManyWithoutDmChatRoomNestedInput
  }

  export type FriendshipUncheckedUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutDmChatRoomNestedInput
  }

  export type FriendshipUncheckedUpdateManyWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyDmChatRoomInput = {
    id?: string
    content: string
    senderId: string
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageUpdateWithoutDmChatRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput
    team?: TeamUpdateOneWithoutMessagesNestedInput
    notifications?: NotificationUpdateManyWithoutMessageNestedInput
    isDeletedBy?: UserUpdateManyWithoutDeletedMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutDmChatRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutMessageNestedInput
    isDeletedBy?: UserUncheckedUpdateManyWithoutDeletedMessagesNestedInput
  }

  export type MessageUncheckedUpdateManyWithoutDmChatRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberCreateManyTeamInput = {
    id?: string
    userId: string
    role: $Enums.TeamRole
    joinedAt?: Date | string
  }

  export type TeamBanCreateManyTeamInput = {
    id?: string
    userId: string
    bannedAt?: Date | string
    reason?: string | null
  }

  export type TeamRequestCreateManyTeamInput = {
    id?: string
    userId: string
    requestedAt?: Date | string
    status: $Enums.RequestStatus
  }

  export type ProjectCreateManyTeamInput = {
    id?: string
    name: string
    description?: string | null
    packages: string
    type: $Enums.ProjectType
    isGitImport?: boolean
    gitKey?: string | null
    gitRepo?: string | null
    updatedAt?: Date | string
    ownerId: string
    generatedById?: string | null
    archeivedBy?: string | null
    createdAt?: Date | string
  }

  export type MessageCreateManyTeamInput = {
    id?: string
    content: string
    senderId: string
    dmChatRoomId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyTeamInput = {
    id?: string
    senderId: string
    receiverId: string
    type?: $Enums.NotificationType
    content?: string | null
    messageId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeamMemberUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTeamsNestedInput
  }

  export type TeamMemberUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamBanUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutTeamBansNestedInput
  }

  export type TeamBanUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamBanUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamRequestUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    user?: UserUpdateOneRequiredWithoutTeamJoinRequestsNestedInput
  }

  export type TeamRequestUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
  }

  export type TeamRequestUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
  }

  export type ProjectUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutProjectsNestedInput
    starredBy?: UserUpdateManyWithoutStarredProjectsNestedInput
    archiveprojectBy?: UserUpdateOneWithoutArchieveProjectsNestedInput
    genratedProjectsby?: UserUpdateOneWithoutAppsGeneratedNestedInput
    files?: FileItemUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerId?: StringFieldUpdateOperationsInput | string
    generatedById?: NullableStringFieldUpdateOperationsInput | string | null
    archeivedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    starredBy?: UserUncheckedUpdateManyWithoutStarredProjectsNestedInput
    files?: FileItemUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    packages?: StringFieldUpdateOperationsInput | string
    type?: EnumProjectTypeFieldUpdateOperationsInput | $Enums.ProjectType
    isGitImport?: BoolFieldUpdateOperationsInput | boolean
    gitKey?: NullableStringFieldUpdateOperationsInput | string | null
    gitRepo?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerId?: StringFieldUpdateOperationsInput | string
    generatedById?: NullableStringFieldUpdateOperationsInput | string | null
    archeivedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput
    dmChatRoom?: FriendshipUpdateOneWithoutMessagesNestedInput
    notifications?: NotificationUpdateManyWithoutMessageNestedInput
    isDeletedBy?: UserUpdateManyWithoutDeletedMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    dmChatRoomId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutMessageNestedInput
    isDeletedBy?: UserUncheckedUpdateManyWithoutDeletedMessagesNestedInput
  }

  export type MessageUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    dmChatRoomId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutSentNotificationsNestedInput
    receiver?: UserUpdateOneRequiredWithoutReceivedNotificationsNestedInput
    message?: MessageUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    messageId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    messageId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileItemCreateManyProjectInput = {
    id?: string
    name: string
    type: string
    content: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateWithoutStarredProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUpdateManyWithoutGenratedProjectsbyNestedInput
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutStarredProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUncheckedUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUncheckedUpdateManyWithoutReceiverNestedInput
    deletedMessages?: MessageUncheckedUpdateManyWithoutIsDeletedByNestedInput
    friendshipsInitiated?: FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateManyWithoutStarredProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FileItemUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: FileItemUpdateOneWithoutChildrenNestedInput
    children?: FileItemUpdateManyWithoutParentNestedInput
  }

  export type FileItemUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: FileItemUncheckedUpdateManyWithoutParentNestedInput
  }

  export type FileItemUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileItemCreateManyParentInput = {
    id?: string
    name: string
    type: string
    content: string
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileItemUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutFilesNestedInput
    children?: FileItemUpdateManyWithoutParentNestedInput
  }

  export type FileItemUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: FileItemUncheckedUpdateManyWithoutParentNestedInput
  }

  export type FileItemUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyMessageInput = {
    id?: string
    senderId: string
    receiverId: string
    type?: $Enums.NotificationType
    content?: string | null
    teamId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUpdateWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutSentNotificationsNestedInput
    receiver?: UserUpdateOneRequiredWithoutReceivedNotificationsNestedInput
    team?: TeamUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpdateWithoutDeletedMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUpdateManyWithoutReceiverNestedInput
    friendshipsInitiated?: FriendshipUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutDeletedMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    archieveProjects?: ProjectUncheckedUpdateManyWithoutArchiveprojectByNestedInput
    appsGenerated?: ProjectUncheckedUpdateManyWithoutGenratedProjectsbyNestedInput
    starredProjects?: ProjectUncheckedUpdateManyWithoutStarredByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    teams?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    teamJoinRequests?: TeamRequestUncheckedUpdateManyWithoutUserNestedInput
    teamBans?: TeamBanUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentNotifications?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    receivedNotifications?: NotificationUncheckedUpdateManyWithoutReceiverNestedInput
    friendshipsInitiated?: FriendshipUncheckedUpdateManyWithoutInitiatorNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateManyWithoutDeletedMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}