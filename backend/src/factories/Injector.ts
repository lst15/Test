class DependencyInjector {
    private repositories: Map<string, any> = new Map();
    private services: Map<string, any> = new Map();

    registerRepository(name: string, repository: any) {
        this.repositories.set(name, repository);
    }

    registerService(name: string, service: any) {
        this.services.set(name, service);
    }

    getRepository<T>(name: string): T {
        const repository = this.repositories.get(name);
        if(repository) return repository as T;

        throw new Error(`Repository ${name} not found`)
    }

    getService<T>(name: string): T {
        const service = this.services.get(name);
        if(service) return service as T;

        throw new Error(`Service ${name} not found`)
    }
}

export const injector = new DependencyInjector();