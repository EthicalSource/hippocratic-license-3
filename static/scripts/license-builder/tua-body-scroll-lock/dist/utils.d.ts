import { Nullable } from './types';
export declare const isServer: () => boolean;
export interface DetectOSResult {
    ios: boolean;
    android: boolean;
}
export declare const detectOS: (ua?: string) => DetectOSResult;
export declare function getEventListenerOptions(options: AddEventListenerOptions): AddEventListenerOptions | boolean;
export declare function noticeRequiredTargetElement(targetElement?: Nullable<HTMLElement>): boolean;
/**
 * Get global function that calls preventDefault
 */
export declare function getPreventEventDefault(): (event: TouchEvent) => void;
export declare function toArray<T>(x?: Nullable<T>): T[];
/**
 * Check if element uses reversed flex direction
 */
export declare function isReversedFlex(element: HTMLElement): {
    column: boolean;
    row: boolean;
};
export interface ScrollBoundaryState {
    isOnTop: boolean;
    isOnBottom: boolean;
    isOnLeft: boolean;
    isOnRight: boolean;
}
/**
 * Check if element is at scroll boundary
 * Supports both normal and reversed flex directions
 */
export declare function getScrollBoundaryState(element: HTMLElement, clientX: number, clientY: number): ScrollBoundaryState;
