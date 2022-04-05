import { BigNumber } from 'ethers'

export interface Race {
  address: string
  name: string
}

export interface Resource {
  address: string
  name: string
  icon: string
}

export interface Reserve {
  resource: Resource
  amount: BigNumber
}

export interface Infrastructure {
  address: string
  name: string
  description: string
  level?: number
  nextUpgrade?: number
  costsResources?: Resource[]
  nextCosts?: BigNumber[]
}

export interface ResourceProducer extends Infrastructure {
  level?: number
  producedResources?: Resource[]
  productionPerBlock?: number[]
  lastHarvest?: number
  nextUpgrade?: number
}

export interface Ship {
  address: string
  name: string
  description: string
}

export enum PlanetStatus {
  Unknown,
  Uncharted,
  Colonized,
  Federated,
  Occupied
}

export interface Planet {
  id: string
  status: PlanetStatus
  ruler: number
  x: number
  y: number
  z: number
  humidity: number
  infrastructures: Infrastructure[]
  reserves: Reserve[]
}

export interface Commander {
  id: number
  name?: string
  race?: Race
  onboarding?: Date
  planets?: string[]
}