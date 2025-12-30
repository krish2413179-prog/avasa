// This file is to dynamically generate TS types
// which we can't get using GenType
// Use @genType.import to link the types back to ReScript code

import type { Logger, EffectCaller } from "envio";
import type * as Entities from "./db/Entities.gen.ts";

export type LoaderContext = {
  /**
   * Access the logger instance with event as a context. The logs will be displayed in the console and Envio Hosted Service.
   */
  readonly log: Logger;
  /**
   * Call the provided Effect with the given input.
   * Effects are the best for external calls with automatic deduplication, error handling and caching.
   * Define a new Effect using createEffect outside of the handler.
   */
  readonly effect: EffectCaller;
  /**
   * True when the handlers run in preload mode - in parallel for the whole batch.
   * Handlers run twice per batch of events, and the first time is the "preload" run
   * During preload entities aren't set, logs are ignored and exceptions are silently swallowed.
   * Preload mode is the best time to populate data to in-memory cache.
   * After preload the handler will run for the second time in sequential order of events.
   */
  readonly isPreload: boolean;
  /**
   * Per-chain state information accessible in event handlers and block handlers.
   * Each chain ID maps to an object containing chain-specific state:
   * - isReady: true when the chain has completed initial sync and is processing live events,
   *            false during historical synchronization
   */
  readonly chains: {
    [chainId: string]: {
      readonly isReady: boolean;
    };
  };
  readonly AIRecommendation: {
    /**
     * Load the entity AIRecommendation from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.AIRecommendation_t | undefined>,
    /**
     * Load the entity AIRecommendation from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.AIRecommendation_t>,
    readonly getWhere: Entities.AIRecommendation_indexedFieldOperations,
    /**
     * Returns the entity AIRecommendation from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.AIRecommendation_t) => Promise<Entities.AIRecommendation_t>,
    /**
     * Set the entity AIRecommendation in the storage.
     */
    readonly set: (entity: Entities.AIRecommendation_t) => void,
    /**
     * Delete the entity AIRecommendation from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly DailyMetrics: {
    /**
     * Load the entity DailyMetrics from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.DailyMetrics_t | undefined>,
    /**
     * Load the entity DailyMetrics from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.DailyMetrics_t>,
    readonly getWhere: Entities.DailyMetrics_indexedFieldOperations,
    /**
     * Returns the entity DailyMetrics from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.DailyMetrics_t) => Promise<Entities.DailyMetrics_t>,
    /**
     * Set the entity DailyMetrics in the storage.
     */
    readonly set: (entity: Entities.DailyMetrics_t) => void,
    /**
     * Delete the entity DailyMetrics from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly LendingTransaction: {
    /**
     * Load the entity LendingTransaction from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.LendingTransaction_t | undefined>,
    /**
     * Load the entity LendingTransaction from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.LendingTransaction_t>,
    readonly getWhere: Entities.LendingTransaction_indexedFieldOperations,
    /**
     * Returns the entity LendingTransaction from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.LendingTransaction_t) => Promise<Entities.LendingTransaction_t>,
    /**
     * Set the entity LendingTransaction in the storage.
     */
    readonly set: (entity: Entities.LendingTransaction_t) => void,
    /**
     * Delete the entity LendingTransaction from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly LivePortfolio: {
    /**
     * Load the entity LivePortfolio from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.LivePortfolio_t | undefined>,
    /**
     * Load the entity LivePortfolio from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.LivePortfolio_t>,
    readonly getWhere: Entities.LivePortfolio_indexedFieldOperations,
    /**
     * Returns the entity LivePortfolio from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.LivePortfolio_t) => Promise<Entities.LivePortfolio_t>,
    /**
     * Set the entity LivePortfolio in the storage.
     */
    readonly set: (entity: Entities.LivePortfolio_t) => void,
    /**
     * Delete the entity LivePortfolio from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly MarketTrend: {
    /**
     * Load the entity MarketTrend from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.MarketTrend_t | undefined>,
    /**
     * Load the entity MarketTrend from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.MarketTrend_t>,
    readonly getWhere: Entities.MarketTrend_indexedFieldOperations,
    /**
     * Returns the entity MarketTrend from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.MarketTrend_t) => Promise<Entities.MarketTrend_t>,
    /**
     * Set the entity MarketTrend in the storage.
     */
    readonly set: (entity: Entities.MarketTrend_t) => void,
    /**
     * Delete the entity MarketTrend from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly PropertyAnalytics: {
    /**
     * Load the entity PropertyAnalytics from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.PropertyAnalytics_t | undefined>,
    /**
     * Load the entity PropertyAnalytics from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.PropertyAnalytics_t>,
    readonly getWhere: Entities.PropertyAnalytics_indexedFieldOperations,
    /**
     * Returns the entity PropertyAnalytics from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.PropertyAnalytics_t) => Promise<Entities.PropertyAnalytics_t>,
    /**
     * Set the entity PropertyAnalytics in the storage.
     */
    readonly set: (entity: Entities.PropertyAnalytics_t) => void,
    /**
     * Delete the entity PropertyAnalytics from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly PropertyPerformance: {
    /**
     * Load the entity PropertyPerformance from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.PropertyPerformance_t | undefined>,
    /**
     * Load the entity PropertyPerformance from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.PropertyPerformance_t>,
    readonly getWhere: Entities.PropertyPerformance_indexedFieldOperations,
    /**
     * Returns the entity PropertyPerformance from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.PropertyPerformance_t) => Promise<Entities.PropertyPerformance_t>,
    /**
     * Set the entity PropertyPerformance in the storage.
     */
    readonly set: (entity: Entities.PropertyPerformance_t) => void,
    /**
     * Delete the entity PropertyPerformance from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly PropertyTransaction: {
    /**
     * Load the entity PropertyTransaction from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.PropertyTransaction_t | undefined>,
    /**
     * Load the entity PropertyTransaction from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.PropertyTransaction_t>,
    readonly getWhere: Entities.PropertyTransaction_indexedFieldOperations,
    /**
     * Returns the entity PropertyTransaction from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.PropertyTransaction_t) => Promise<Entities.PropertyTransaction_t>,
    /**
     * Set the entity PropertyTransaction in the storage.
     */
    readonly set: (entity: Entities.PropertyTransaction_t) => void,
    /**
     * Delete the entity PropertyTransaction from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly PropertyUpdate: {
    /**
     * Load the entity PropertyUpdate from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.PropertyUpdate_t | undefined>,
    /**
     * Load the entity PropertyUpdate from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.PropertyUpdate_t>,
    readonly getWhere: Entities.PropertyUpdate_indexedFieldOperations,
    /**
     * Returns the entity PropertyUpdate from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.PropertyUpdate_t) => Promise<Entities.PropertyUpdate_t>,
    /**
     * Set the entity PropertyUpdate in the storage.
     */
    readonly set: (entity: Entities.PropertyUpdate_t) => void,
    /**
     * Delete the entity PropertyUpdate from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly StreamTransaction: {
    /**
     * Load the entity StreamTransaction from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.StreamTransaction_t | undefined>,
    /**
     * Load the entity StreamTransaction from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.StreamTransaction_t>,
    readonly getWhere: Entities.StreamTransaction_indexedFieldOperations,
    /**
     * Returns the entity StreamTransaction from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.StreamTransaction_t) => Promise<Entities.StreamTransaction_t>,
    /**
     * Set the entity StreamTransaction in the storage.
     */
    readonly set: (entity: Entities.StreamTransaction_t) => void,
    /**
     * Delete the entity StreamTransaction from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly SwapTransaction: {
    /**
     * Load the entity SwapTransaction from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.SwapTransaction_t | undefined>,
    /**
     * Load the entity SwapTransaction from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.SwapTransaction_t>,
    readonly getWhere: Entities.SwapTransaction_indexedFieldOperations,
    /**
     * Returns the entity SwapTransaction from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.SwapTransaction_t) => Promise<Entities.SwapTransaction_t>,
    /**
     * Set the entity SwapTransaction in the storage.
     */
    readonly set: (entity: Entities.SwapTransaction_t) => void,
    /**
     * Delete the entity SwapTransaction from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly TransferTransaction: {
    /**
     * Load the entity TransferTransaction from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.TransferTransaction_t | undefined>,
    /**
     * Load the entity TransferTransaction from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.TransferTransaction_t>,
    readonly getWhere: Entities.TransferTransaction_indexedFieldOperations,
    /**
     * Returns the entity TransferTransaction from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.TransferTransaction_t) => Promise<Entities.TransferTransaction_t>,
    /**
     * Set the entity TransferTransaction in the storage.
     */
    readonly set: (entity: Entities.TransferTransaction_t) => void,
    /**
     * Delete the entity TransferTransaction from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly UserAnalytics: {
    /**
     * Load the entity UserAnalytics from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.UserAnalytics_t | undefined>,
    /**
     * Load the entity UserAnalytics from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.UserAnalytics_t>,
    readonly getWhere: Entities.UserAnalytics_indexedFieldOperations,
    /**
     * Returns the entity UserAnalytics from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.UserAnalytics_t) => Promise<Entities.UserAnalytics_t>,
    /**
     * Set the entity UserAnalytics in the storage.
     */
    readonly set: (entity: Entities.UserAnalytics_t) => void,
    /**
     * Delete the entity UserAnalytics from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly UserPortfolio: {
    /**
     * Load the entity UserPortfolio from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.UserPortfolio_t | undefined>,
    /**
     * Load the entity UserPortfolio from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.UserPortfolio_t>,
    readonly getWhere: Entities.UserPortfolio_indexedFieldOperations,
    /**
     * Returns the entity UserPortfolio from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.UserPortfolio_t) => Promise<Entities.UserPortfolio_t>,
    /**
     * Set the entity UserPortfolio in the storage.
     */
    readonly set: (entity: Entities.UserPortfolio_t) => void,
    /**
     * Delete the entity UserPortfolio from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly UserPreferences: {
    /**
     * Load the entity UserPreferences from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.UserPreferences_t | undefined>,
    /**
     * Load the entity UserPreferences from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.UserPreferences_t>,
    readonly getWhere: Entities.UserPreferences_indexedFieldOperations,
    /**
     * Returns the entity UserPreferences from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.UserPreferences_t) => Promise<Entities.UserPreferences_t>,
    /**
     * Set the entity UserPreferences in the storage.
     */
    readonly set: (entity: Entities.UserPreferences_t) => void,
    /**
     * Delete the entity UserPreferences from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly YieldTransaction: {
    /**
     * Load the entity YieldTransaction from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.YieldTransaction_t | undefined>,
    /**
     * Load the entity YieldTransaction from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.YieldTransaction_t>,
    readonly getWhere: Entities.YieldTransaction_indexedFieldOperations,
    /**
     * Returns the entity YieldTransaction from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.YieldTransaction_t) => Promise<Entities.YieldTransaction_t>,
    /**
     * Set the entity YieldTransaction in the storage.
     */
    readonly set: (entity: Entities.YieldTransaction_t) => void,
    /**
     * Delete the entity YieldTransaction from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
};

export type HandlerContext = {
  /**
   * Access the logger instance with event as a context. The logs will be displayed in the console and Envio Hosted Service.
   */
  readonly log: Logger;
  /**
   * Call the provided Effect with the given input.
   * Effects are the best for external calls with automatic deduplication, error handling and caching.
   * Define a new Effect using createEffect outside of the handler.
   */
  readonly effect: EffectCaller;
  /**
   * Per-chain state information accessible in event handlers and block handlers.
   * Each chain ID maps to an object containing chain-specific state:
   * - isReady: true when the chain has completed initial sync and is processing live events,
   *            false during historical synchronization
   */
  readonly chains: {
    [chainId: string]: {
      readonly isReady: boolean;
    };
  };
  readonly AIRecommendation: {
    /**
     * Load the entity AIRecommendation from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.AIRecommendation_t | undefined>,
    /**
     * Load the entity AIRecommendation from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.AIRecommendation_t>,
    /**
     * Returns the entity AIRecommendation from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.AIRecommendation_t) => Promise<Entities.AIRecommendation_t>,
    /**
     * Set the entity AIRecommendation in the storage.
     */
    readonly set: (entity: Entities.AIRecommendation_t) => void,
    /**
     * Delete the entity AIRecommendation from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly DailyMetrics: {
    /**
     * Load the entity DailyMetrics from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.DailyMetrics_t | undefined>,
    /**
     * Load the entity DailyMetrics from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.DailyMetrics_t>,
    /**
     * Returns the entity DailyMetrics from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.DailyMetrics_t) => Promise<Entities.DailyMetrics_t>,
    /**
     * Set the entity DailyMetrics in the storage.
     */
    readonly set: (entity: Entities.DailyMetrics_t) => void,
    /**
     * Delete the entity DailyMetrics from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly LendingTransaction: {
    /**
     * Load the entity LendingTransaction from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.LendingTransaction_t | undefined>,
    /**
     * Load the entity LendingTransaction from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.LendingTransaction_t>,
    /**
     * Returns the entity LendingTransaction from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.LendingTransaction_t) => Promise<Entities.LendingTransaction_t>,
    /**
     * Set the entity LendingTransaction in the storage.
     */
    readonly set: (entity: Entities.LendingTransaction_t) => void,
    /**
     * Delete the entity LendingTransaction from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly LivePortfolio: {
    /**
     * Load the entity LivePortfolio from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.LivePortfolio_t | undefined>,
    /**
     * Load the entity LivePortfolio from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.LivePortfolio_t>,
    /**
     * Returns the entity LivePortfolio from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.LivePortfolio_t) => Promise<Entities.LivePortfolio_t>,
    /**
     * Set the entity LivePortfolio in the storage.
     */
    readonly set: (entity: Entities.LivePortfolio_t) => void,
    /**
     * Delete the entity LivePortfolio from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly MarketTrend: {
    /**
     * Load the entity MarketTrend from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.MarketTrend_t | undefined>,
    /**
     * Load the entity MarketTrend from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.MarketTrend_t>,
    /**
     * Returns the entity MarketTrend from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.MarketTrend_t) => Promise<Entities.MarketTrend_t>,
    /**
     * Set the entity MarketTrend in the storage.
     */
    readonly set: (entity: Entities.MarketTrend_t) => void,
    /**
     * Delete the entity MarketTrend from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly PropertyAnalytics: {
    /**
     * Load the entity PropertyAnalytics from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.PropertyAnalytics_t | undefined>,
    /**
     * Load the entity PropertyAnalytics from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.PropertyAnalytics_t>,
    /**
     * Returns the entity PropertyAnalytics from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.PropertyAnalytics_t) => Promise<Entities.PropertyAnalytics_t>,
    /**
     * Set the entity PropertyAnalytics in the storage.
     */
    readonly set: (entity: Entities.PropertyAnalytics_t) => void,
    /**
     * Delete the entity PropertyAnalytics from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly PropertyPerformance: {
    /**
     * Load the entity PropertyPerformance from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.PropertyPerformance_t | undefined>,
    /**
     * Load the entity PropertyPerformance from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.PropertyPerformance_t>,
    /**
     * Returns the entity PropertyPerformance from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.PropertyPerformance_t) => Promise<Entities.PropertyPerformance_t>,
    /**
     * Set the entity PropertyPerformance in the storage.
     */
    readonly set: (entity: Entities.PropertyPerformance_t) => void,
    /**
     * Delete the entity PropertyPerformance from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly PropertyTransaction: {
    /**
     * Load the entity PropertyTransaction from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.PropertyTransaction_t | undefined>,
    /**
     * Load the entity PropertyTransaction from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.PropertyTransaction_t>,
    /**
     * Returns the entity PropertyTransaction from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.PropertyTransaction_t) => Promise<Entities.PropertyTransaction_t>,
    /**
     * Set the entity PropertyTransaction in the storage.
     */
    readonly set: (entity: Entities.PropertyTransaction_t) => void,
    /**
     * Delete the entity PropertyTransaction from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly PropertyUpdate: {
    /**
     * Load the entity PropertyUpdate from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.PropertyUpdate_t | undefined>,
    /**
     * Load the entity PropertyUpdate from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.PropertyUpdate_t>,
    /**
     * Returns the entity PropertyUpdate from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.PropertyUpdate_t) => Promise<Entities.PropertyUpdate_t>,
    /**
     * Set the entity PropertyUpdate in the storage.
     */
    readonly set: (entity: Entities.PropertyUpdate_t) => void,
    /**
     * Delete the entity PropertyUpdate from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly StreamTransaction: {
    /**
     * Load the entity StreamTransaction from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.StreamTransaction_t | undefined>,
    /**
     * Load the entity StreamTransaction from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.StreamTransaction_t>,
    /**
     * Returns the entity StreamTransaction from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.StreamTransaction_t) => Promise<Entities.StreamTransaction_t>,
    /**
     * Set the entity StreamTransaction in the storage.
     */
    readonly set: (entity: Entities.StreamTransaction_t) => void,
    /**
     * Delete the entity StreamTransaction from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly SwapTransaction: {
    /**
     * Load the entity SwapTransaction from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.SwapTransaction_t | undefined>,
    /**
     * Load the entity SwapTransaction from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.SwapTransaction_t>,
    /**
     * Returns the entity SwapTransaction from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.SwapTransaction_t) => Promise<Entities.SwapTransaction_t>,
    /**
     * Set the entity SwapTransaction in the storage.
     */
    readonly set: (entity: Entities.SwapTransaction_t) => void,
    /**
     * Delete the entity SwapTransaction from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly TransferTransaction: {
    /**
     * Load the entity TransferTransaction from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.TransferTransaction_t | undefined>,
    /**
     * Load the entity TransferTransaction from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.TransferTransaction_t>,
    /**
     * Returns the entity TransferTransaction from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.TransferTransaction_t) => Promise<Entities.TransferTransaction_t>,
    /**
     * Set the entity TransferTransaction in the storage.
     */
    readonly set: (entity: Entities.TransferTransaction_t) => void,
    /**
     * Delete the entity TransferTransaction from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly UserAnalytics: {
    /**
     * Load the entity UserAnalytics from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.UserAnalytics_t | undefined>,
    /**
     * Load the entity UserAnalytics from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.UserAnalytics_t>,
    /**
     * Returns the entity UserAnalytics from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.UserAnalytics_t) => Promise<Entities.UserAnalytics_t>,
    /**
     * Set the entity UserAnalytics in the storage.
     */
    readonly set: (entity: Entities.UserAnalytics_t) => void,
    /**
     * Delete the entity UserAnalytics from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly UserPortfolio: {
    /**
     * Load the entity UserPortfolio from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.UserPortfolio_t | undefined>,
    /**
     * Load the entity UserPortfolio from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.UserPortfolio_t>,
    /**
     * Returns the entity UserPortfolio from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.UserPortfolio_t) => Promise<Entities.UserPortfolio_t>,
    /**
     * Set the entity UserPortfolio in the storage.
     */
    readonly set: (entity: Entities.UserPortfolio_t) => void,
    /**
     * Delete the entity UserPortfolio from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly UserPreferences: {
    /**
     * Load the entity UserPreferences from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.UserPreferences_t | undefined>,
    /**
     * Load the entity UserPreferences from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.UserPreferences_t>,
    /**
     * Returns the entity UserPreferences from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.UserPreferences_t) => Promise<Entities.UserPreferences_t>,
    /**
     * Set the entity UserPreferences in the storage.
     */
    readonly set: (entity: Entities.UserPreferences_t) => void,
    /**
     * Delete the entity UserPreferences from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
  readonly YieldTransaction: {
    /**
     * Load the entity YieldTransaction from the storage by ID.
     * If the entity is not found, returns undefined.
     */
    readonly get: (id: string) => Promise<Entities.YieldTransaction_t | undefined>,
    /**
     * Load the entity YieldTransaction from the storage by ID.
     * If the entity is not found, throws an error.
     */
    readonly getOrThrow: (id: string, message?: string) => Promise<Entities.YieldTransaction_t>,
    /**
     * Returns the entity YieldTransaction from the storage by ID.
     * If the entity is not found, creates it using provided parameters and returns it.
     */
    readonly getOrCreate: (entity: Entities.YieldTransaction_t) => Promise<Entities.YieldTransaction_t>,
    /**
     * Set the entity YieldTransaction in the storage.
     */
    readonly set: (entity: Entities.YieldTransaction_t) => void,
    /**
     * Delete the entity YieldTransaction from the storage.
     *
     * The 'deleteUnsafe' method is experimental and unsafe. You should manually handle all entity references after deletion to maintain database consistency.
     */
    readonly deleteUnsafe: (id: string) => void,
  }
};
