import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table
export default class Modlogs extends Model {
  @Column(DataType.STRING)
  guildID: string;

  @Column(DataType.STRING)
  channelID: string;
}