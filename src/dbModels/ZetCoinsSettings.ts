import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table
export default class ZetCoinsSettings extends Model {
  @Column(DataType.STRING)
  guildID: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "<:zetcoins:929419222436708373>",
  })
  icon: string;
}