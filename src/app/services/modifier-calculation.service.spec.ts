import { TestBed, async, inject } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ModifierCalculationService } from './modifier-calculation.service';
import { ModifierFactory } from '@app/factories';
import { ModifierContext } from '@app/models';

describe('ModifierCalculationService', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ModifierCalculationService]
        }).compileComponents();
    }));

    describe('Observable API', () => {
        it('should calculate break damage correctly with just base break', async(inject([ModifierCalculationService], (service) => {
            const baseBreakSource = Observable.of([
                ModifierFactory.CreateBaseBreakModifier(100),
            ]);

            service.calculateBreakDamage(baseBreakSource).subscribe((value) => {
                expect(value).toBe(100, `Computed value ${value} did not match expected value 100.`);
            });
        })));

        it('should calculate break damage correctly with base break and boost', async(inject([ModifierCalculationService], (service) => {
            const baseBoostSource = Observable.of([
                ModifierFactory.CreateBaseBreakModifier(100),
                ModifierFactory.CreateBoostModifier()
            ]);

            service.calculateBreakDamage(baseBoostSource).subscribe((value) => {
                expect(value).toBe(200, `Computed value ${value} did not match expected value 100 * 2 = 200.`);
            });
        })));

        it('should calculate break damage correctly with base break, break fractals, and boost',
            async(inject([ModifierCalculationService], (service) => {
               const source = Observable.of([
                   ModifierFactory.CreateBaseBreakModifier(100),
                   ModifierFactory.CreateBoostModifier(),
                   ModifierFactory.CreateFractalModifier(ModifierContext.BreakDamage, 5),
                   ModifierFactory.CreateFractalModifier(ModifierContext.BreakDamage, 5)
               ]);

               service.calculateBreakDamage(source).subscribe((value) => {
                   expect(value).toBeCloseTo(220, `Computed value ${value} did not match expected value 100 * 1.1 * 2 = 200`);
               });
        })));

        it('should calculate break damage correctly with base break and custom panel',
            async(inject([ModifierCalculationService], (service) => {
                const source = Observable.of([
                    ModifierFactory.CreateBaseBreakModifier(100),
                    ModifierFactory.CreateCustomPanelModifier(ModifierContext.BreakDamage, 500)
                ]);

                service.calculateBreakDamage(source).subscribe((value) => {
                    expect(value).toBeCloseTo(600, `Computed value ${value} did not match expected value 100 + 500 = 600`);
                });
            })));

        it('should calculate break damage correctly with base break, custom panel, break fractals, boost, and BDD',
            async(inject([ModifierCalculationService], (service) => {
                const source = Observable.of([
                    ModifierFactory.CreateBaseBreakModifier(1000),
                    ModifierFactory.CreateCustomPanelModifier(ModifierContext.BreakDamage, 500),
                    ModifierFactory.CreateFractalModifier(ModifierContext.BreakDamage, 5),
                    ModifierFactory.CreateFractalModifier(ModifierContext.BreakDamage, 5),
                    ModifierFactory.CreateFractalModifier(ModifierContext.BreakDamage, 5),
                    ModifierFactory.CreateBoostModifier(),
                    ModifierFactory.CreateBDDModifier()
                ]);

                service.calculateBreakDamage(source).subscribe((value) => {
                    expect(value).toBeCloseTo(5175, 7,
                        `Computed value ${value} did not match expected value 1000 + 500 * 1.15 * 2 * 1.5`);
                });
            })));
    });
});

