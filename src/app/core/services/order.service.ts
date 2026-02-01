import { Injectable, signal, computed, effect } from '@angular/core';
import { Artwork } from './supabase.service';

// ─── Interfaces ───────────────────────────────────────────────────────────

export interface PotflowerOrder {
    client: string;
    potflower: number;
    artwork: Artwork | null;
}

// ─── Constante de clave en localStorage ──────────────────────────────────

const STORAGE_KEY = 'potflower_order';

// ─── Servicio ─────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class OrderService {

    // Estado interno usando señales
    private _order = signal<PotflowerOrder>(this.loadFromStorage());

    // Señal pública de solo lectura para consumir en componentes
    readonly order = this._order.asReadonly();

    // Computed derivados
    readonly client = computed(() => this._order().client);
    readonly potflower = computed(() => this._order().potflower);
    readonly artwork = computed(() => this._order().artwork);
    readonly isValidOrder = computed(() => {
        const { client, potflower } = this._order();
        return client.length > 2 && potflower > 0;
    });

    constructor() {
        // Efecto: persiste automáticamente cada vez que cambia la orden
        effect(() => {
            this.saveToStorage(this._order());
        });
    }

    // ─── Métodos públicos ───────────────────────────────────────────────────

    /** Asigna el nombre del cliente */
    setClient(name: string): void {
        this.updateOrder({ client: name });
    }

    /** Asigna el tamaño de la maceta (en cm) */
    setPotflower(size: number): void {
        this.updateOrder({ potflower: size });
    }

    /** Agrega o reemplaza el artwork (diseño) de la orden */
    setArtwork(artwork: Artwork): void {
        this.updateOrder({ artwork });
    }

    /** Elimina el artwork actual de la orden */
    removeArtwork(): void {
        this.updateOrder({ artwork: null });
    }

    /** Reinicia toda la orden al estado inicial */
    resetOrder(): void {
        this._order.set(this.getEmptyOrder());
    }

    // ─── Métodos privados ───────────────────────────────────────────────────

    /** Merge parcial sobre el estado actual */
    private updateOrder(partial: Partial<PotflowerOrder>): void {
        this._order.update(current => ({ ...current, ...partial }));
    }

    /** Estado vacío por defecto */
    private getEmptyOrder(): PotflowerOrder {
        return { client: '', potflower: 0, artwork: null };
    }

    /** Lee la orden guardada en localStorage */
    private loadFromStorage(): PotflowerOrder {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as PotflowerOrder;
                // Validación básica de estructura
                if (typeof parsed.client === 'string' && typeof parsed.potflower === 'number') {
                    return parsed;
                }
            }
        } catch {
            console.warn('[OrderService] Error al leer localStorage, se usa orden vacía.');
        }
        return this.getEmptyOrder();
    }

    /** Guarda la orden actual en localStorage */
    private saveToStorage(order: PotflowerOrder): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
        } catch {
            console.warn('[OrderService] Error al escribir en localStorage.');
        }
    }
}