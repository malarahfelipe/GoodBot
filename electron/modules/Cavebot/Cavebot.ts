import { MiniMap } from '../Minimap/MiniMap'
import { Alpha } from '../../../common/models/Utils'
import { CavebotConfig } from '../../../common/models/CavebotConfig'
import { CAVEBOT_ACTIONS } from '../../../common/models/CavebotActions.enum'
import { SupplyKey } from '../../../common/models/SupplyKey'
import { Supplier } from '../Supplier/Supplier'
import { ActionWalk } from '../../../common/models/ActionAlpha'

export class Cavebot {
  private currentStep: Alpha = null
  private static instance: Cavebot
  private config: CavebotConfig
  private configs: CavebotConfig[]
  private path: ActionWalk[]
  private supplies: SupplyKey[]
  private constructor() { }

  static async getInstance(): Promise<Cavebot> {
    if (!this.instance) this.instance = await new Cavebot().initialize()
    return this.instance
  }

  public async initialize(): Promise<Cavebot> {
    await this.loadConfigs()
    return this
  }

  public async loadConfigs(): Promise<void> {
    this.configs = [
      {
        id: Math.random().toString(36).toUpperCase().slice(2),
        name: 'ELITE KNIGHT VAMPIRES EDRON',
        profission: 'EK',
        goOutPath: [
          {
            alpha: 'E',
            action: {
              name: 'Andar',
              handler: CAVEBOT_ACTIONS.checkSupply
            }
          },
          {
            alpha: 'F',
            action: {
              name: 'Andar',
              handler: CAVEBOT_ACTIONS.goToNextWp
            }
          },
          {
            alpha: 'G',
            action: {
              name: 'Andar',
              handler: CAVEBOT_ACTIONS.goToNextWp
            }
          }
        ],
        actions: [
          {
            alpha: 'A',
            action: {
              name: 'Andar',
              handler: CAVEBOT_ACTIONS.checkSupply
            }
          },
          {
            alpha: 'B',
            action: {
              name: 'Andar',
              handler: CAVEBOT_ACTIONS.goToNextWp
            }
          },
          {
            alpha: 'C',
            action: {
              name: 'Andar',
              handler: CAVEBOT_ACTIONS.goToNextWp
            }
          },
          {
            alpha: 'D',
            action: {
              name: 'Andar',
              handler: CAVEBOT_ACTIONS.goToNextWp
            }
          }
        ]
      }
    ]
  }

  public async getConfigs(): Promise<CavebotConfig[]> {
    return this.configs
  }

  public setConfig(configId: string): CavebotConfig {
    this.currentStep = null
    this.config = null
    this.config = this.configs.find(({ id }) => id === configId)
    this.path = this.config.actions
    return this.config
  }

  public async goToNextStep(): Promise<void> {
    const alphabet = this.path.map(({ alpha }) => alpha)
    const currentPosition = alphabet.indexOf(this.currentStep)
    const nextIndex = (currentPosition + 1) < alphabet.length ? currentPosition + 1 : 0
    this.currentStep = alphabet[nextIndex]
    console.log('this.currentStep', this.currentStep)
    return (await MiniMap.getInstance()).goTo(this.currentStep)
  }

  public async checkSupply(): Promise<void> {
    const needsSupply = (await Promise.all(this.supplies.map(Supplier.isBelowMin))).some(isBelowMin => !!isBelowMin)
    if (needsSupply) {
      this.currentStep = null
      this.path = this.config.goOutPath
    }
    return this.goToNextStep()
  }

  public async refillMana(): Promise<void> {
    console.log('refillMana')
  }
}
