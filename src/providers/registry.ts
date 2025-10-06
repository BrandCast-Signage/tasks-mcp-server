import type { BaseTaskProvider, ProviderInfo } from '../types/index.js';
import { TaskProvider } from '../types/index.js';

/**
 * Central registry for all task providers
 */
export class ProviderRegistry {
  private providers = new Map<TaskProvider, BaseTaskProvider>();

  /**
   * Register a provider
   */
  register(provider: BaseTaskProvider): void {
    this.providers.set(provider.id, provider);
  }

  /**
   * Get a provider by ID
   */
  get(providerId: TaskProvider): BaseTaskProvider {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Provider not found: ${providerId}`);
    }
    return provider;
  }

  /**
   * Get all registered providers
   */
  getAll(): BaseTaskProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get provider information for all registered providers
   */
  getAllInfo(): ProviderInfo[] {
    return this.getAll().map(provider => ({
      id: provider.id,
      name: provider.name,
      capabilities: provider.capabilities,
    }));
  }

  /**
   * Check if a provider is registered
   */
  has(providerId: TaskProvider): boolean {
    return this.providers.has(providerId);
  }

  /**
   * Get provider capabilities
   */
  getCapabilities(providerId: TaskProvider) {
    const provider = this.get(providerId);
    return provider.capabilities;
  }
}

// Create singleton instance
export const providerRegistry = new ProviderRegistry();
