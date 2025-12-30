
type hyperSyncConfig = {endpointUrl: string}
type hyperFuelConfig = {endpointUrl: string}

@genType.opaque
type rpcConfig = {
  syncConfig: Config.sourceSync,
}

@genType
type syncSource = HyperSync(hyperSyncConfig) | HyperFuel(hyperFuelConfig) | Rpc(rpcConfig)

@genType.opaque
type aliasAbi = Ethers.abi

type eventName = string

type contract = {
  name: string,
  abi: aliasAbi,
  addresses: array<string>,
  events: array<eventName>,
}

type configYaml = {
  syncSource,
  startBlock: int,
  confirmedBlockThreshold: int,
  contracts: dict<contract>,
  lowercaseAddresses: bool,
}

let publicConfig = ChainMap.fromArrayUnsafe([
  {
    let contracts = Js.Dict.fromArray([
      (
        "ManhattanLuxuryApartments",
        {
          name: "ManhattanLuxuryApartments",
          abi: Types.ManhattanLuxuryApartments.abi,
          addresses: [
            "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
          ],
          events: [
            Types.ManhattanLuxuryApartments.SharesPurchased.name,
            Types.ManhattanLuxuryApartments.SharesWithdrawn.name,
            Types.ManhattanLuxuryApartments.YieldDistributed.name,
            Types.ManhattanLuxuryApartments.PropertyUpdated.name,
            Types.ManhattanLuxuryApartments.Transfer.name,
          ],
        }
      ),
      (
        "MiamiBeachCondos",
        {
          name: "MiamiBeachCondos",
          abi: Types.MiamiBeachCondos.abi,
          addresses: [
            "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
          ],
          events: [
            Types.MiamiBeachCondos.SharesPurchased.name,
            Types.MiamiBeachCondos.SharesWithdrawn.name,
            Types.MiamiBeachCondos.YieldDistributed.name,
            Types.MiamiBeachCondos.PropertyUpdated.name,
            Types.MiamiBeachCondos.Transfer.name,
          ],
        }
      ),
      (
        "AustinTechHubOffice",
        {
          name: "AustinTechHubOffice",
          abi: Types.AustinTechHubOffice.abi,
          addresses: [
            "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
          ],
          events: [
            Types.AustinTechHubOffice.SharesPurchased.name,
            Types.AustinTechHubOffice.SharesWithdrawn.name,
            Types.AustinTechHubOffice.YieldDistributed.name,
            Types.AustinTechHubOffice.PropertyUpdated.name,
            Types.AustinTechHubOffice.Transfer.name,
          ],
        }
      ),
      (
        "SeattleWarehouseDistrict",
        {
          name: "SeattleWarehouseDistrict",
          abi: Types.SeattleWarehouseDistrict.abi,
          addresses: [
            "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26",
          ],
          events: [
            Types.SeattleWarehouseDistrict.SharesPurchased.name,
            Types.SeattleWarehouseDistrict.SharesWithdrawn.name,
            Types.SeattleWarehouseDistrict.YieldDistributed.name,
            Types.SeattleWarehouseDistrict.PropertyUpdated.name,
            Types.SeattleWarehouseDistrict.Transfer.name,
          ],
        }
      ),
      (
        "DenverMountainResort",
        {
          name: "DenverMountainResort",
          abi: Types.DenverMountainResort.abi,
          addresses: [
            "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC",
          ],
          events: [
            Types.DenverMountainResort.SharesPurchased.name,
            Types.DenverMountainResort.SharesWithdrawn.name,
            Types.DenverMountainResort.YieldDistributed.name,
            Types.DenverMountainResort.PropertyUpdated.name,
            Types.DenverMountainResort.Transfer.name,
          ],
        }
      ),
      (
        "ChicagoDowntownLofts",
        {
          name: "ChicagoDowntownLofts",
          abi: Types.ChicagoDowntownLofts.abi,
          addresses: [
            "0x86337dDaF2661A069D0DcB5D160585acC2d15E9a",
          ],
          events: [
            Types.ChicagoDowntownLofts.SharesPurchased.name,
            Types.ChicagoDowntownLofts.SharesWithdrawn.name,
            Types.ChicagoDowntownLofts.YieldDistributed.name,
            Types.ChicagoDowntownLofts.PropertyUpdated.name,
            Types.ChicagoDowntownLofts.Transfer.name,
          ],
        }
      ),
      (
        "LosAngelesStudioComplex",
        {
          name: "LosAngelesStudioComplex",
          abi: Types.LosAngelesStudioComplex.abi,
          addresses: [
            "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4",
          ],
          events: [
            Types.LosAngelesStudioComplex.SharesPurchased.name,
            Types.LosAngelesStudioComplex.SharesWithdrawn.name,
            Types.LosAngelesStudioComplex.YieldDistributed.name,
            Types.LosAngelesStudioComplex.PropertyUpdated.name,
            Types.LosAngelesStudioComplex.Transfer.name,
          ],
        }
      ),
      (
        "PhoenixRetailPlaza",
        {
          name: "PhoenixRetailPlaza",
          abi: Types.PhoenixRetailPlaza.abi,
          addresses: [
            "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8",
          ],
          events: [
            Types.PhoenixRetailPlaza.SharesPurchased.name,
            Types.PhoenixRetailPlaza.SharesWithdrawn.name,
            Types.PhoenixRetailPlaza.YieldDistributed.name,
            Types.PhoenixRetailPlaza.PropertyUpdated.name,
            Types.PhoenixRetailPlaza.Transfer.name,
          ],
        }
      ),
      (
        "BostonHistoricBrownstones",
        {
          name: "BostonHistoricBrownstones",
          abi: Types.BostonHistoricBrownstones.abi,
          addresses: [
            "0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B",
          ],
          events: [
            Types.BostonHistoricBrownstones.SharesPurchased.name,
            Types.BostonHistoricBrownstones.SharesWithdrawn.name,
            Types.BostonHistoricBrownstones.YieldDistributed.name,
            Types.BostonHistoricBrownstones.PropertyUpdated.name,
            Types.BostonHistoricBrownstones.Transfer.name,
          ],
        }
      ),
      (
        "NashvilleMusicDistrict",
        {
          name: "NashvilleMusicDistrict",
          abi: Types.NashvilleMusicDistrict.abi,
          addresses: [
            "0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3",
          ],
          events: [
            Types.NashvilleMusicDistrict.SharesPurchased.name,
            Types.NashvilleMusicDistrict.SharesWithdrawn.name,
            Types.NashvilleMusicDistrict.YieldDistributed.name,
            Types.NashvilleMusicDistrict.PropertyUpdated.name,
            Types.NashvilleMusicDistrict.Transfer.name,
          ],
        }
      ),
    ])
    let chain = ChainMap.Chain.makeUnsafe(~chainId=84532)
    (
      chain,
      {
        confirmedBlockThreshold: 200,
        syncSource: HyperSync({endpointUrl: "https://84532.hypersync.xyz"}),
        startBlock: 0,
        contracts,
        lowercaseAddresses: false
      }
    )
  },
])

@genType
let getGeneratedByChainId: int => configYaml = chainId => {
  let chain = ChainMap.Chain.makeUnsafe(~chainId)
  if !(publicConfig->ChainMap.has(chain)) {
    Js.Exn.raiseError(
      "No chain with id " ++ chain->ChainMap.Chain.toString ++ " found in config.yaml",
    )
  }
  publicConfig->ChainMap.get(chain)
}
