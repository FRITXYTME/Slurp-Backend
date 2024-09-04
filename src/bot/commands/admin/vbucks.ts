import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import Users from '../../../model/user.js';
import Profiles from '../../../model/profiles.js';


export const data = new SlashCommandBuilder()
	.setName('vbucks')
	.setDescription('Lets you change a users amount of vbucks')
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user you want to change the vbucks of')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('vbucks')
			.setDescription('The amount of vbucks you want to give (Can be a negative number to take vbucks)')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
	.setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {

	const selectedUser = interaction.options.getUser('user');
	const selectedUserId: string = selectedUser?.id!;

	const user = await Users.findOne({ discordId: selectedUserId });
	if (!user) return interaction.reply({ content: "That user does not own an account", ephemeral: true });

	const vbucks: number = parseInt(interaction.options.getString('vbucks')!);

	const profile = await Profiles.findOneAndUpdate(
		{ accountId: user.accountId },
		{ $inc: { 'profiles.common_core.items.Currency:MtxPurchased.quantity': vbucks } },
	);
	if (!profile) return interaction.reply({ content: "That user does not own an account", ephemeral: true });

	const embed = new EmbedBuilder()
		.setTitle("vBucks changed")
		.setDescription("Successfully changed the amount of vbucks for <@" + selectedUserId + "> by " + vbucks)
		.setColor("#2b2d31")
		.setFooter({
			text: "Slurp",
			iconURL: "https://th.bing.com/th/id/OIP.pBqz5q0UL4_9cG7iPhcAXAHaEK?rs=1&pid=ImgDetMain",
		})
		.setTimestamp();

	await interaction.reply({ embeds: [embed], ephemeral: true });

}
