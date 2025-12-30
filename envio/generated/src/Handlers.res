  @genType
module AustinTechHubOffice = {
  module SharesPurchased = Types.MakeRegister(Types.AustinTechHubOffice.SharesPurchased)
  module SharesWithdrawn = Types.MakeRegister(Types.AustinTechHubOffice.SharesWithdrawn)
  module YieldDistributed = Types.MakeRegister(Types.AustinTechHubOffice.YieldDistributed)
  module PropertyUpdated = Types.MakeRegister(Types.AustinTechHubOffice.PropertyUpdated)
  module Transfer = Types.MakeRegister(Types.AustinTechHubOffice.Transfer)
}

  @genType
module BostonHistoricBrownstones = {
  module SharesPurchased = Types.MakeRegister(Types.BostonHistoricBrownstones.SharesPurchased)
  module SharesWithdrawn = Types.MakeRegister(Types.BostonHistoricBrownstones.SharesWithdrawn)
  module YieldDistributed = Types.MakeRegister(Types.BostonHistoricBrownstones.YieldDistributed)
  module PropertyUpdated = Types.MakeRegister(Types.BostonHistoricBrownstones.PropertyUpdated)
  module Transfer = Types.MakeRegister(Types.BostonHistoricBrownstones.Transfer)
}

  @genType
module ChicagoDowntownLofts = {
  module SharesPurchased = Types.MakeRegister(Types.ChicagoDowntownLofts.SharesPurchased)
  module SharesWithdrawn = Types.MakeRegister(Types.ChicagoDowntownLofts.SharesWithdrawn)
  module YieldDistributed = Types.MakeRegister(Types.ChicagoDowntownLofts.YieldDistributed)
  module PropertyUpdated = Types.MakeRegister(Types.ChicagoDowntownLofts.PropertyUpdated)
  module Transfer = Types.MakeRegister(Types.ChicagoDowntownLofts.Transfer)
}

  @genType
module DenverMountainResort = {
  module SharesPurchased = Types.MakeRegister(Types.DenverMountainResort.SharesPurchased)
  module SharesWithdrawn = Types.MakeRegister(Types.DenverMountainResort.SharesWithdrawn)
  module YieldDistributed = Types.MakeRegister(Types.DenverMountainResort.YieldDistributed)
  module PropertyUpdated = Types.MakeRegister(Types.DenverMountainResort.PropertyUpdated)
  module Transfer = Types.MakeRegister(Types.DenverMountainResort.Transfer)
}

  @genType
module LosAngelesStudioComplex = {
  module SharesPurchased = Types.MakeRegister(Types.LosAngelesStudioComplex.SharesPurchased)
  module SharesWithdrawn = Types.MakeRegister(Types.LosAngelesStudioComplex.SharesWithdrawn)
  module YieldDistributed = Types.MakeRegister(Types.LosAngelesStudioComplex.YieldDistributed)
  module PropertyUpdated = Types.MakeRegister(Types.LosAngelesStudioComplex.PropertyUpdated)
  module Transfer = Types.MakeRegister(Types.LosAngelesStudioComplex.Transfer)
}

  @genType
module ManhattanLuxuryApartments = {
  module SharesPurchased = Types.MakeRegister(Types.ManhattanLuxuryApartments.SharesPurchased)
  module SharesWithdrawn = Types.MakeRegister(Types.ManhattanLuxuryApartments.SharesWithdrawn)
  module YieldDistributed = Types.MakeRegister(Types.ManhattanLuxuryApartments.YieldDistributed)
  module PropertyUpdated = Types.MakeRegister(Types.ManhattanLuxuryApartments.PropertyUpdated)
  module Transfer = Types.MakeRegister(Types.ManhattanLuxuryApartments.Transfer)
}

  @genType
module MiamiBeachCondos = {
  module SharesPurchased = Types.MakeRegister(Types.MiamiBeachCondos.SharesPurchased)
  module SharesWithdrawn = Types.MakeRegister(Types.MiamiBeachCondos.SharesWithdrawn)
  module YieldDistributed = Types.MakeRegister(Types.MiamiBeachCondos.YieldDistributed)
  module PropertyUpdated = Types.MakeRegister(Types.MiamiBeachCondos.PropertyUpdated)
  module Transfer = Types.MakeRegister(Types.MiamiBeachCondos.Transfer)
}

  @genType
module NashvilleMusicDistrict = {
  module SharesPurchased = Types.MakeRegister(Types.NashvilleMusicDistrict.SharesPurchased)
  module SharesWithdrawn = Types.MakeRegister(Types.NashvilleMusicDistrict.SharesWithdrawn)
  module YieldDistributed = Types.MakeRegister(Types.NashvilleMusicDistrict.YieldDistributed)
  module PropertyUpdated = Types.MakeRegister(Types.NashvilleMusicDistrict.PropertyUpdated)
  module Transfer = Types.MakeRegister(Types.NashvilleMusicDistrict.Transfer)
}

  @genType
module PhoenixRetailPlaza = {
  module SharesPurchased = Types.MakeRegister(Types.PhoenixRetailPlaza.SharesPurchased)
  module SharesWithdrawn = Types.MakeRegister(Types.PhoenixRetailPlaza.SharesWithdrawn)
  module YieldDistributed = Types.MakeRegister(Types.PhoenixRetailPlaza.YieldDistributed)
  module PropertyUpdated = Types.MakeRegister(Types.PhoenixRetailPlaza.PropertyUpdated)
  module Transfer = Types.MakeRegister(Types.PhoenixRetailPlaza.Transfer)
}

  @genType
module SeattleWarehouseDistrict = {
  module SharesPurchased = Types.MakeRegister(Types.SeattleWarehouseDistrict.SharesPurchased)
  module SharesWithdrawn = Types.MakeRegister(Types.SeattleWarehouseDistrict.SharesWithdrawn)
  module YieldDistributed = Types.MakeRegister(Types.SeattleWarehouseDistrict.YieldDistributed)
  module PropertyUpdated = Types.MakeRegister(Types.SeattleWarehouseDistrict.PropertyUpdated)
  module Transfer = Types.MakeRegister(Types.SeattleWarehouseDistrict.Transfer)
}

@genType /** Register a Block Handler. It'll be called for every block by default. */
let onBlock: (
  Envio.onBlockOptions<Types.chain>,
  Envio.onBlockArgs<Types.handlerContext> => promise<unit>,
) => unit = (
  EventRegister.onBlock: (unknown, Internal.onBlockArgs => promise<unit>) => unit
)->Utils.magic
